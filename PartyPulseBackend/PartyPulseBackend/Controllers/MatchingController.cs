using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.Models;
using System.Security.Claims;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class MatchingController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public MatchingController(PartyPulseContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get a list of recommended users, prioritising those who attend the same events.
        /// Excludes users the current user has already swiped on.
        /// </summary>
        [HttpGet("Recommendations")]
        public async Task<IActionResult> GetRecommendations([FromQuery] int limit = 20)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            // IDs the current user has already decided on (as User1 OR User2)
            var decidedIdsAsUser1 = await _context.Matches
                .Where(m => m.User1ID == currentUserId && m.User1Liked != null)
                .Select(m => m.User2ID)
                .ToListAsync();

            var decidedIdsAsUser2 = await _context.Matches
                .Where(m => m.User2ID == currentUserId && m.User2Liked != null)
                .Select(m => m.User1ID)
                .ToListAsync();

            var alreadyDecided = decidedIdsAsUser1.Concat(decidedIdsAsUser2).Distinct().ToHashSet();
            alreadyDecided.Add(currentUserId); // exclude self

            // Events the current user is attending
            var myEventIds = await _context.Attendances
                .Where(a => a.UserID == currentUserId)
                .Select(a => a.EventID)
                .ToListAsync();

            // Users who share at least one event
            var sharedEventUserIds = await _context.Attendances
                .Where(a => myEventIds.Contains(a.EventID) && a.UserID != currentUserId)
                .Select(a => a.UserID)
                .Distinct()
                .ToListAsync();

            var sharedSet = sharedEventUserIds.ToHashSet();

            // Candidate users
            var candidates = await _context.Users
                .Where(u => u.IsActive == true && !alreadyDecided.Contains(u.UserID))
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    u.DisplayName,
                    u.Bio,
                    u.Gender,
                    u.BirthDate,
                    u.LookingFor,
                    u.ProfilePicture,
                    u.ProfilePictureMime,
                    HasSharedEvent = sharedSet.Contains(u.UserID)
                })
                .OrderByDescending(u => u.HasSharedEvent)
                .Take(limit)
                .ToListAsync();

            var result = candidates.Select(u => new
            {
                u.UserID,
                u.Username,
                Name = u.DisplayName ?? u.Username,
                u.Bio,
                u.Gender,
                Age = u.BirthDate.HasValue
                    ? (int)((DateOnly.FromDateTime(DateTime.Today).DayNumber - u.BirthDate.Value.DayNumber) / 365.25)
                    : (int?)null,
                u.LookingFor,
                u.HasSharedEvent,
                ProfilePictureBase64 = u.ProfilePicture != null && u.ProfilePictureMime != null
                    ? $"data:{u.ProfilePictureMime};base64,{Convert.ToBase64String(u.ProfilePicture)}"
                    : null
            });

            return Ok(result);
        }

        /// <summary>
        /// Record a Like (true) or Dislike (false) swipe on a target user.
        /// Returns isMatch: true and chatRoomId if both users liked each other.
        /// </summary>
        [HttpPost("Swipe")]
        public async Task<IActionResult> Swipe([FromBody] SwipeRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            if (currentUserId == request.TargetUserId)
                return BadRequest("Nem swipelehetsz saját magadra.");

            // Check if a match record already exists (in any direction)
            var existingMatch = await _context.Matches.FirstOrDefaultAsync(m =>
                (m.User1ID == currentUserId && m.User2ID == request.TargetUserId) ||
                (m.User1ID == request.TargetUserId && m.User2ID == currentUserId));

            bool isMatch = false;
            Guid? chatRoomId = null;

            if (existingMatch == null)
            {
                // First swipe: create a new record
                var newMatch = new Match
                {
                    User1ID = currentUserId,
                    User2ID = request.TargetUserId,
                    User1Liked = request.IsLike,
                    User2Liked = null,
                    MatchedAt = null,
                    ChatRoomID = null
                };
                _context.Matches.Add(newMatch);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Second swipe: update the other person's decision
                if (existingMatch.User1ID == currentUserId)
                    existingMatch.User1Liked = request.IsLike;
                else
                    existingMatch.User2Liked = request.IsLike;

                // Check for mutual like → MATCH!
                if (existingMatch.User1Liked == true && existingMatch.User2Liked == true)
                {
                    isMatch = true;
                    chatRoomId = Guid.NewGuid();
                    existingMatch.MatchedAt = DateTime.UtcNow;
                    existingMatch.ChatRoomID = chatRoomId;
                    existingMatch.User1Seen = false;
                    existingMatch.User2Seen = false;
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                success = true,
                isMatch,
                chatRoomId,
                matchId = existingMatch?.MatchID ?? 0 // matchId hozzáadása a válaszhoz
            });
        }

        /// <summary>
        /// Get the list of confirmed matches (both liked) for the current user.
        /// </summary>
        [HttpGet("Matches")]
        public async Task<IActionResult> GetMatches()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            var matches = await _context.Matches
                .Where(m =>
                    (m.User1ID == currentUserId || m.User2ID == currentUserId) &&
                    m.User1Liked == true && m.User2Liked == true)
                .Include(m => m.User1)
                .Include(m => m.User2)
                .OrderByDescending(m => m.MatchedAt)
                .ToListAsync();

            var result = matches.Select(m =>
            {
                var partner = m.User1ID == currentUserId ? m.User2 : m.User1;
                var isSeen = m.User1ID == currentUserId ? m.User1Seen : m.User2Seen;
                return new
                {
                    m.MatchID,
                    m.ChatRoomID,
                    m.MatchedAt,
                    IsSeen = isSeen,
                    Partner = new
                    {
                        partner.UserID,
                        partner.Username,
                        Name = partner.DisplayName ?? partner.Username,
                        partner.Bio,
                        ProfilePictureBase64 = partner.ProfilePicture != null && partner.ProfilePictureMime != null
                            ? $"data:{partner.ProfilePictureMime};base64,{Convert.ToBase64String(partner.ProfilePicture)}"
                            : null
                    }
                };
            });

            return Ok(result);
        }

        /// <summary>
        /// Mark all currently unseen matches as seen for the current user.
        /// </summary>
        [HttpPost("MarkSeen")]
        public async Task<IActionResult> MarkSeen()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            var unseenMatches = await _context.Matches
                .Where(m => m.MatchedAt != null && 
                            ((m.User1ID == currentUserId && m.User1Seen == false) ||
                             (m.User2ID == currentUserId && m.User2Seen == false)))
                .ToListAsync();

            if (!unseenMatches.Any()) return Ok(new { success = true });

            foreach (var match in unseenMatches)
            {
                if (match.User1ID == currentUserId) match.User1Seen = true;
                if (match.User2ID == currentUserId) match.User2Seen = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }

    public class SwipeRequest
    {
        public int TargetUserId { get; set; }
        public bool IsLike { get; set; }
    }
}
