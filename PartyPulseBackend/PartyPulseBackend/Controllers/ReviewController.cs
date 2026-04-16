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
    public class ReviewController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public ReviewController(PartyPulseContext context)
        {
            _context = context;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO model)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Érvénytelen munkamenet.");
            int currentUserId = int.Parse(userIdClaim);

            var ev = await _context.Events.FindAsync(model.EventId);
            if (ev == null) return NotFound("Az esemény nem található.");

            if (ev.EventDateTime.AddHours(2) > DateTime.Now)
            {
                return BadRequest("Csak befejeződött eseményt lehet értékelni (a kezdés után legalább 2 órával).");
            }

            var hasAttended = await _context.Attendances.AnyAsync(a => a.EventID == model.EventId && a.UserID == currentUserId);
            if (!hasAttended)
            {
                return BadRequest("Csak akkor értékelheted a bulit, ha jelezted a részvételed.");
            }

            var existingReview = await _context.Reviews.FirstOrDefaultAsync(r => r.EventID == model.EventId && r.UserID == currentUserId);
            if (existingReview != null)
            {
                return BadRequest("Már értékelted ezt az eseményt.");
            }

            if (model.Rating < 1 || model.Rating > 5)
            {
                return BadRequest("Az értékelésnek 1 és 5 között kell lennie.");
            }

            var review = new Review
            {
                EventID = model.EventId,
                UserID = currentUserId,
                Rating = (sbyte)model.Rating,
                Comment = model.Comment,
                CreatedAt = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Értékelés sikeresen elmentve!" });
        }

        [HttpGet("Event/{eventId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEventReviews(int eventId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.EventID == eventId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.ReviewID,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    User = new
                    {
                        r.User.UserID,
                        Name = r.User.DisplayName ?? r.User.Username,
                        ProfilePictureBase64 = r.User.ProfilePicture != null && r.User.ProfilePictureMime != null
                            ? $"data:{r.User.ProfilePictureMime};base64,{Convert.ToBase64String(r.User.ProfilePicture)}"
                            : null
                    }
                })
                .ToListAsync();

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return Ok(new { AverageRating = averageRating, TotalReviews = reviews.Count, Reviews = reviews });
        }
    }

    public class CreateReviewDTO
    {
        public int EventId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}