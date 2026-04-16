using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using PartyPulseBackend.Models;
using System.Security.Claims;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public AttendanceController(PartyPulseContext context)
        {
            _context = context;
        }

        [HttpPost("Toggle/{eventId}")]
        [Authorize]
        public async Task<IActionResult> ToggleAttendance(int eventId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Érvénytelen munkamenet.");

            int userId = int.Parse(userIdClaim);

            
            var eventExists = await _context.Events.AnyAsync(e => e.EventID == eventId);
            if (!eventExists)
                return NotFound("Az esemény nem található.");

            // Megnézzük, van-e már bejegyzés
            var existing = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserID == userId && a.EventID == eventId);

            if (existing != null)
            {
                
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    // Csak a kezdeti 5 pontot vonjuk le, ha még nem kapta meg a végső 25-öt, 
                    // vagy ha valamiért többet kapott, akkor azt is? 
                    // Maradjunk annál, hogy amit eddig nyert ezen az eseményen, azt elvesszük.
                    user.Points -= existing.PointsEarned ?? 0;
                    if (user.Points < 0) user.Points = 0;
                }

                _context.Attendances.Remove(existing);
                await _context.SaveChangesAsync();
                return Ok(new AttendanceStatusDTO { IsAttending = false, Status = null });
            }
            else
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.Points += 5;
                }

                var newAttendance = new Attendance
                {
                    UserID = userId,
                    EventID = eventId,
                    RegisteredAt = DateTime.Now,
                    Status = "going",
                    PointsEarned = 5 // Kezdőpontok a jelentkezésért
                };
                _context.Attendances.Add(newAttendance);
                await _context.SaveChangesAsync();
                return Ok(new AttendanceStatusDTO { IsAttending = true, Status = "going" });
            }
        }

        // GET /Attendance/Status/{eventId}
        // Lekérdezi, hogy a bejelentkezett felhasználó részt vesz-e az eseményen
        [HttpGet("Status/{eventId}")]
        [Authorize]
        public async Task<IActionResult> GetStatus(int eventId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Érvénytelen munkamenet.");

            int userId = int.Parse(userIdClaim);

            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserID == userId && a.EventID == eventId);

            return Ok(new AttendanceStatusDTO
            {
                IsAttending = attendance != null,
                Status = attendance?.Status
            });
        }

        
        // A bejelentkezett felhasználó összes bejelentett eseménye
        [HttpGet("MyEvents")]
        [Authorize]
        public async Task<IActionResult> GetMyEvents()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Érvénytelen munkamenet.");

            int userId = int.Parse(userIdClaim);

            try
            {
                var now = DateTime.Now;
                var attendances = await _context.Attendances
                    .Where(a => a.UserID == userId)
                    .Include(a => a.Event)
                    .ToListAsync();

                bool pointsChanged = false;
                var user = await _context.Users.FindAsync(userId);

                foreach (var a in attendances)
                {
                    // Ha véget ért az esemény (pl. kezdés + 2 óra múltán vesszük véglegesnek a részvételt)
                    // És még nem kapta meg a 25 bónusz pontot (összesen 30-at)
                    if (a.Event.EventDateTime.AddHours(2) < now && (a.PointsEarned ?? 0) < 30)
                    {
                        int pointsToAdd = 30 - (a.PointsEarned ?? 0);
                        a.PointsEarned = 30;
                        if (user != null)
                        {
                            user.Points += pointsToAdd;
                            pointsChanged = true;
                        }
                    }
                }

                if (pointsChanged)
                {
                    await _context.SaveChangesAsync();
                }

                var myEvents = attendances
                    .OrderBy(a => a.Event.EventDateTime)
                    .Select(a => new AttendedEventDTO
                    {
                        EventID = a.Event.EventID,
                        Title = a.Event.Title,
                        Description = a.Event.Description,
                        EventDateTime = a.Event.EventDateTime,
                        LocationName = a.Event.LocationName,
                        Address = a.Event.Address,
                        ImageUrl = a.Event.ImageFileName != null
                                        ? (a.Event.ImageFileName.StartsWith("http") ? a.Event.ImageFileName : $"/images/events/{a.Event.ImageFileName}")
                                        : null,
                        MusicStyle = a.Event.MusicStyle,
                        TicketPrice = a.Event.TicketPrice,
                        Status = a.Status,
                        RegisteredAt = a.RegisteredAt
                    })
                    .ToList();

                return Ok(myEvents);
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null) msg += " | " + ex.InnerException.Message;
                return BadRequest($"Hiba az események lekérésekor: {msg}");
            }
        }

        // GET /Attendance/AttendeesCount/{eventId}
        // Hány fő jelzett részvételt az eseményen
        [HttpGet("AttendeesCount/{eventId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAttendeesCount(int eventId)
        {
            var count = await _context.Attendances.CountAsync(a => a.EventID == eventId);
            return Ok(new { eventId, count });
        }
    }
}
