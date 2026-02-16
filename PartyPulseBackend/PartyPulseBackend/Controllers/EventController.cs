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
    public class EventController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        private readonly IWebHostEnvironment _env;

        [HttpGet("AllEvents")]
        public async Task<IActionResult> GetAllEvents()
        {
            try
            {
                var rawEvents = await _context.Events
                    .FromSqlRaw("SELECT EventID, Title, Description, EventDateTime, LocationName, ImageFileName, Address, TicketPrice, OrganizerID, MusicStyle, MaxAttendees, IsPublic, CreatedAt, ST_X(Location) AS Longitude, ST_Y(Location) AS Latitude FROM Events")
                    .AsNoTracking()
                    .ToListAsync();

                var events = rawEvents.Select(e => new EventDTO
                {
                    EventID = e.EventID,
                    Title = e.Title,
                    Description = e.Description,
                    EventDateTime = e.EventDateTime,
                    Address = e.Address,
                    LocationName = e.LocationName,
                    MusicStyle = e.MusicStyle,
                    Latitude = e.Latitude,
                    Longitude = e.Longitude,
                    ImageUrl = e.ImageFileName != null
                        ? $"/images/events/{e.ImageFileName}"
                        : null
                }).ToList();

                return Ok(events);
            }
            catch (Exception ex)
            {
                
                var msg = $"Hiba az események betöltésekor: {ex.Message}";
                if (ex.InnerException != null)
                {
                    msg += $" | Belső hiba: {ex.InnerException.Message}";
                }
                return BadRequest(msg);
            }
        }

        public EventController(PartyPulseContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "admin,organizer")]
        public async Task<IActionResult> CreateEvent([FromForm] CreateEventDTO model)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("Érvénytelen munkamenet.");
                int currentUserId = int.Parse(userIdClaim);

                string? fileName = null;


                if (model.Image != null && model.Image.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_env.WebRootPath, "images", "events");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Image.FileName);
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(fileStream);
                    }
                }

                var newEvent = new @event
                {
                    Title = model.Title,
                    Description = model.Description,
                    EventDateTime = model.EventDateTime,
                    LocationName = model.LocationName,
                    Address = model.Address,
                    TicketPrice = model.TicketPrice,
                    MusicStyle = model.MusicStyle,
                    MaxAttendees = model.MaxAttendees,
                    IsPublic = model.IsPublic,
                    OrganizerID = currentUserId,
                    ImageFileName = fileName,
                    CreatedAt = DateTime.Now
                };

                _context.Events.Add(newEvent);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Esemény sikeresen létrehozva!", eventId = newEvent.EventID });
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a létrehozás során: {ex.Message}");
            }
        }


    }
}