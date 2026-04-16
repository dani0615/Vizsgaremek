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
    public class EventFavoriteController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public EventFavoriteController(PartyPulseContext context)
        {
            _context = context;
        }

        [HttpGet("Status/{eventId}")]
        [Authorize]
        public async Task<IActionResult> GetStatus(int eventId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Nem vagy bejelentkezve.");

            int currentUserId = int.Parse(userIdClaim);

            var favorite = await _context.Eventfavorites
                .FirstOrDefaultAsync(f => f.UserID == currentUserId && f.EventID == eventId);

            return Ok(new { isFavorite = favorite != null });
        }

        [HttpPost("Toggle/{eventId}")]
        [Authorize]
        public async Task<IActionResult> ToggleFavorite(int eventId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Nem vagy bejelentkezve.");

            int currentUserId = int.Parse(userIdClaim);

            var eventExists = await _context.Events.AnyAsync(e => e.EventID == eventId);
            if (!eventExists) return NotFound("Az esemény nem található.");

            var favorite = await _context.Eventfavorites
                .FirstOrDefaultAsync(f => f.UserID == currentUserId && f.EventID == eventId);

            if (favorite != null)
            {
                _context.Eventfavorites.Remove(favorite);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorite = false, message = "Eltávolítva a kedvencek közül." });
            }
            else
            {
                favorite = new Eventfavorite
                {
                    UserID = currentUserId,
                    EventID = eventId,
                    CreatedAt = DateTime.Now
                };
                _context.Eventfavorites.Add(favorite);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorite = true, message = "Hozzáadva a kedvencekhez!" });
            }
        }

        [HttpGet("MyFavorites")]
        [Authorize]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Nem vagy bejelentkezve.");

            int currentUserId = int.Parse(userIdClaim);

            var myFavorites = await _context.Eventfavorites
                .Include(f => f.Event)
                .Where(f => f.UserID == currentUserId)
                .Select(f => new
                {
                    f.Event.EventID,
                    f.Event.Title,
                    f.Event.Description,
                    f.Event.EventDateTime,
                    f.Event.LocationName,
                    f.Event.Address,
                    f.Event.ImageFileName,
                    f.Event.MusicStyle
                })
                .ToListAsync();

            var result = myFavorites.Select(e => new
            {
                EventID = e.EventID,
                Title = e.Title,
                Description = e.Description,
                EventDateTime = e.EventDateTime,
                LocationName = e.LocationName,
                Address = e.Address,
                ImageUrl = e.ImageFileName != null ? $"/images/events/{e.ImageFileName}" : null,
                MusicStyle = e.MusicStyle
            });

            return Ok(result);
        }
    }
}
