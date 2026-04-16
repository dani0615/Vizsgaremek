using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.Hubs;
using PartyPulseBackend.Models;
using System.Security.Claims;
using System.Text;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        private readonly byte[] _aesKey;

        public ChatController(PartyPulseContext context, IConfiguration configuration)
        {
            _context = context;
            var keyString = configuration["AesSettings:EncryptionKey"] ?? "PartyPulseAES256Key!2026SecretXX";
            _aesKey = Encoding.UTF8.GetBytes(keyString);
        }

        /// <summary>
        /// Lekéri egy match chat előzményeit (dekódolva).
        /// Csak akkor engedélyezett, ha a bejelentkezett user tagja a matchnek.
        /// </summary>
        [HttpGet("History/{matchId:int}")]
        public async Task<IActionResult> GetHistory(int matchId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            // Ellenőrzés: a user tagja-e ennek a matchnek?
            var match = await _context.Matches.FirstOrDefaultAsync(m =>
                m.MatchID == matchId &&
                (m.User1ID == currentUserId || m.User2ID == currentUserId) &&
                m.User1Liked == true && m.User2Liked == true);

            if (match == null) return Forbid();

            // Üzenetek lekérése lapozással (legújabbak elöl, kliensnél megfordítjuk)
            var messages = await _context.Chatmessages
                .Where(c => c.MatchID == matchId)
                .Include(c => c.Sender)
                .OrderByDescending(c => c.SentAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Dekódolás és DTO összeállítás
            var result = messages.Select(m =>
            {
                string decryptedText;
                try
                {
                    decryptedText = ChatHub.DecryptMessage(m.EncryptedMessage, m.EncryptionIV, _aesKey);
                }
                catch
                {
                    decryptedText = "[Nem olvasható üzenet]";
                }

                return new
                {
                    m.MessageID,
                    m.MatchID,
                    m.SentAt,
                    m.IsRead,
                    message = decryptedText,
                    sender = new
                    {
                        m.Sender.UserID,
                        m.Sender.Username,
                        Name = m.Sender.DisplayName ?? m.Sender.Username,
                        ProfilePictureBase64 = m.Sender.ProfilePicture != null && m.Sender.ProfilePictureMime != null
                            ? $"data:{m.Sender.ProfilePictureMime};base64,{Convert.ToBase64String(m.Sender.ProfilePicture)}"
                            : null
                    }
                };
            })
            .OrderBy(m => m.SentAt) // időrendi sorrend a kliensnek
            .ToList();

            // Olvasottnak jelölés
            var unreadIds = messages
                .Where(m => m.SenderID != currentUserId && m.IsRead == false)
                .Select(m => m.MessageID)
                .ToList();

            if (unreadIds.Any())
            {
                await _context.Chatmessages
                    .Where(c => unreadIds.Contains(c.MessageID))
                    .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsRead, true));
            }

            return Ok(result);
        }

        /// <summary>
        /// Lekéri az olvasatlan üzenetek számát az összes matchben (badge-hez).
        /// </summary>
        [HttpGet("UnreadCount")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            // Azok a matchek ahol a user részt vesz
            var myMatchIds = await _context.Matches
                .Where(m =>
                    (m.User1ID == currentUserId || m.User2ID == currentUserId) &&
                    m.User1Liked == true && m.User2Liked == true)
                .Select(m => m.MatchID)
                .ToListAsync();

            var unreadCount = await _context.Chatmessages
                .Where(c =>
                    myMatchIds.Contains(c.MatchID) &&
                    c.SenderID != currentUserId &&
                    c.IsRead == false)
                .CountAsync();

            return Ok(new { unreadCount });
        }

        [HttpPost("Initiate/{targetUserId}")]
        public async Task<IActionResult> InitiateChat(int targetUserId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(userIdClaim);

            if (currentUserId == targetUserId) return BadRequest("Nem beszélgethetsz saját magaddal.");

            var existingMatch = await _context.Matches.FirstOrDefaultAsync(m =>
                (m.User1ID == currentUserId && m.User2ID == targetUserId) ||
                (m.User1ID == targetUserId && m.User2ID == currentUserId));

            if (existingMatch != null)
            {
                if (existingMatch.User1Liked != true || existingMatch.User2Liked != true || existingMatch.ChatRoomID == null)
                {
                    existingMatch.User1Liked = true;
                    existingMatch.User2Liked = true;
                    existingMatch.MatchedAt = DateTime.UtcNow;
                    if (existingMatch.ChatRoomID == null)
                        existingMatch.ChatRoomID = Guid.NewGuid();
                    await _context.SaveChangesAsync();
                }
                return Ok(new { matchId = existingMatch.MatchID, chatRoomId = existingMatch.ChatRoomID });
            }

            var newMatch = new Match
            {
                User1ID = currentUserId,
                User2ID = targetUserId,
                User1Liked = true,
                User2Liked = true,
                MatchedAt = DateTime.UtcNow,
                ChatRoomID = Guid.NewGuid()
            };
            _context.Matches.Add(newMatch);
            await _context.SaveChangesAsync();

            return Ok(new { matchId = newMatch.MatchID, chatRoomId = newMatch.ChatRoomID });
        }
    }
}
