using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using PartyPulseBackend.Models;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly Cloudinary _cloudinary;

        public EventController(PartyPulseContext context, IWebHostEnvironment env, Cloudinary cloudinary)
        {
            _context = context;
            _env = env;
            _cloudinary = cloudinary;
        }

        [HttpGet("AllEvents")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEvents()
        {
            try
            {
                var rawEvents = await _context.Events
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
                    TicketPrice = e.TicketPrice,
                    MaxAttendees = e.MaxAttendees,
                    IsPublic = e.IsPublic ?? true,
                    Latitude = e.Location != null ? e.Location.Y : null,
                    Longitude = e.Location != null ? e.Location.X : null,
                    ImageUrl = e.ImageFileName != null
                                    ? (e.ImageFileName.StartsWith("http") ? e.ImageFileName : $"/images/events/{e.ImageFileName}")
                                    : null,
                    IsFeatured = e.IsFeatured
                }).ToList();

                return Ok(events);
            }
            catch (Exception ex)
            {
                var msg = $"Hiba az események betöltésekor: {ex.Message}";
                if (ex.InnerException != null)
                    msg += $" | Belső hiba: {ex.InnerException.Message}";
                return BadRequest(msg);
            }
        }

        /// <summary>
        /// Batch endpoint: returns all events together with attendee counts and
        /// (for authenticated users) the current user's isAttending / isFavorite flags.
        /// Replaces N×3 per-card API calls with a single request.
        /// </summary>
        [HttpGet("AllEventsWithStatus")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEventsWithStatus()
        {
            try
            {
                var rawEvents = await _context.Events
                    .AsNoTracking()
                    .ToListAsync();

                // --- Attendee counts: one query, grouped in memory ---
                var attendeeCounts = await _context.Attendances
                    .AsNoTracking()
                    .GroupBy(a => a.EventID)
                    .Select(g => new { EventID = g.Key, Count = g.Count() })
                    .ToListAsync();

                var countMap = attendeeCounts.ToDictionary(x => x.EventID, x => x.Count);

                // --- Per-user status (only when authenticated) ---
                HashSet<int> attendingSet = new();
                HashSet<int> favoriteSet  = new();
                HashSet<int> reviewedSet  = new();

                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                bool isAuth = userIdClaim != null;

                if (isAuth)
                {
                    int currentUserId = int.Parse(userIdClaim!);

                    var attendingIds = await _context.Attendances
                        .AsNoTracking()
                        .Where(a => a.UserID == currentUserId)
                        .Select(a => a.EventID)
                        .ToListAsync();

                    var favoriteIds = await _context.Eventfavorites
                        .AsNoTracking()
                        .Where(f => f.UserID == currentUserId)
                        .Select(f => f.EventID)
                        .ToListAsync();

                    attendingSet = new HashSet<int>(attendingIds);
                    favoriteSet  = new HashSet<int>(favoriteIds);

                    var reviewedIds = await _context.Reviews
                        .AsNoTracking()
                        .Where(r => r.UserID == currentUserId)
                        .Select(r => r.EventID)
                        .ToListAsync();
                    
                    reviewedSet = new HashSet<int>(reviewedIds);
                }

                var now = DateTime.Now;

                var events = rawEvents.Select(e => new EventDTO
                {
                    EventID      = e.EventID,
                    Title        = e.Title,
                    Description  = e.Description,
                    EventDateTime= e.EventDateTime,
                    Address      = e.Address,
                    LocationName = e.LocationName,
                    MusicStyle   = e.MusicStyle,
                    TicketPrice  = e.TicketPrice,
                    MaxAttendees = e.MaxAttendees,
                    IsPublic     = e.IsPublic ?? true,
                    Latitude     = e.Location != null ? e.Location.Y : null,
                    Longitude    = e.Location != null ? e.Location.X : null,
                    ImageUrl     = e.ImageFileName != null
                                       ? (e.ImageFileName.StartsWith("http") ? e.ImageFileName : $"/images/events/{e.ImageFileName}")
                                       : null,
                    AttendeeCount = countMap.TryGetValue(e.EventID, out var cnt) ? cnt : 0,
                    IsAttending   = isAuth ? attendingSet.Contains(e.EventID) : null,
                    IsFavorite    = isAuth ? favoriteSet.Contains(e.EventID)  : null,
                    HasEnded      = e.EventDateTime.AddHours(2) < now,
                    IsReviewed    = isAuth ? reviewedSet.Contains(e.EventID)  : null,
                    IsFeatured    = e.IsFeatured
                }).ToList();

                return Ok(events);
            }
            catch (Exception ex)
            {
                var msg = $"Hiba az események betöltésekor: {ex.Message}";
                if (ex.InnerException != null)
                    msg += $" | Belső hiba: {ex.InnerException.Message}";
                return BadRequest(msg);
            }
        }

        [HttpPost("Create")]
        [Authorize(Roles = "admin,organizer")]
        public async Task<IActionResult> CreateEvent([FromForm] CreateEventDTO model)
        {
            try
            {

                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("Érvénytelen munkamenet.");

                int currentUserId = int.Parse(userIdClaim);

                if (string.IsNullOrWhiteSpace(model.Title))
                    return BadRequest("A buli neve kötelező!");

                if (string.IsNullOrWhiteSpace(model.MusicStyle))
                    return BadRequest("A zenei stílus kötelező!");


                if (_cloudinary == null)
                    throw new Exception("Cloudinary nincs konfigurálva.");

                string? fileName = null;
                if (model.Image != null && model.Image.Length > 0)
                {
                    using var stream = model.Image.OpenReadStream();
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(model.Image.FileName, stream),
                        Folder = "events",
                        DisplayName = model.Title
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    if (uploadResult.Error != null)
                        throw new Exception($"Cloudinary hiba: {uploadResult.Error.Message}");
                    fileName = uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString();
                }

                string style = (model.MusicStyle ?? "other").ToLower();
                if (style.Contains("drum") && style.Contains("bass")) style = "drumandbass";
                else if (style == "edm") style = "electronic";
                else if (style == "hip-hop" || style == "trap" || style == "r&b") style = "hiphop";

                var allowedStyles = new[] { "rock", "pop", "electronic", "hiphop", "jazz", "latin", "metal", "house", "techno", "drumandbass", "other" };
                if (!allowedStyles.Contains(style)) style = "other";

                // Koordináták kézi parzolása InvariantCulture-rel
                double? parsedLat = null;
                double? parsedLon = null;
                if (!string.IsNullOrEmpty(model.Latitude) && double.TryParse(model.Latitude.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double lat))
                    parsedLat = lat;
                if (!string.IsNullOrEmpty(model.Longitude) && double.TryParse(model.Longitude.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double lon))
                    parsedLon = lon;

                // Mentés nyers SQL-el, hogy a POINT típust kezelni tudjuk (mivel az NOT NULL az adatbázisban)
                double latVal = parsedLat ?? 47.4979; // Alapértelmezett Budapest ha nincs megadva
                double lonVal = parsedLon ?? 19.0402;
                DateTime now = DateTime.Now;

                if (model.IsFeatured)
                {
                    var featuredCount = await _context.Events
                        .AsNoTracking()
                        .CountAsync(e => e.IsFeatured && e.EventDateTime.AddHours(2) > now);

                    if (featuredCount >= 3)
                    {
                        return BadRequest("Már van 3 aktív kiemelt esemény. Ahhoz, hogy ezt kiemeld, előbb szüntesd meg egy másik esemény kiemelt státuszát!");
                    }
                }

                await _context.Database.ExecuteSqlInterpolatedAsync($@"
                    INSERT INTO events (
                        Title, Description, EventDateTime, Location, LocationName, 
                        ImageFileName, Address, TicketPrice, OrganizerID, MusicStyle, 
                        MaxAttendees, IsPublic, IsFeatured, CreatedAt
                    ) VALUES (
                        {model.Title}, {model.Description}, {model.EventDateTime}, POINT({lonVal}, {latVal}), {model.LocationName}, 
                        {fileName}, {model.Address}, {model.TicketPrice ?? 0}, {currentUserId}, {style}, 
                        {model.MaxAttendees}, {model.IsPublic}, {model.IsFeatured}, {DateTime.Now}
                    )");

                var lastId = await _context.Events
                    .OrderByDescending(e => e.EventID)
                    .Select(e => e.EventID)
                    .FirstOrDefaultAsync();

                return Ok(new { message = "Esemény sikeresen létrehozva!", eventId = lastId });
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null) msg += " | " + ex.InnerException.Message;
                return BadRequest($"Hiba a létrehozás során: {msg}");
            }
        }

        [HttpPut("Update/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] CreateEventDTO model)
        {
            try
            {
                var ev = await _context.Events.FindAsync(id);
                if (ev == null)
                    return NotFound("Az esemény nem található.");

                if (string.IsNullOrWhiteSpace(model.Title))
                    model.Title = ev.Title;

                if (string.IsNullOrWhiteSpace(model.MusicStyle))
                    model.MusicStyle = ev.MusicStyle;

                if (_cloudinary == null)
                    throw new Exception("Cloudinary nincs konfigurálva.");

                string? fileName = ev.ImageFileName;
                if (model.Image != null && model.Image.Length > 0)
                {
                    // Upload new image to Cloudinary
                    using var stream = model.Image.OpenReadStream();
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(model.Image.FileName, stream),
                        Folder = "events",
                        DisplayName = model.Title ?? "Event Image"
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    if (uploadResult == null)
                        throw new Exception("Cloudinary válasz hiba (null).");
                    
                    if (uploadResult.Error != null)
                        throw new Exception($"Cloudinary hiba: {uploadResult.Error.Message}");
                    
                    fileName = uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString();

                    if (string.IsNullOrEmpty(fileName))
                        throw new Exception("Cloudinary nem adott vissza URL-t.");
                }

                string style = (model.MusicStyle ?? ev.MusicStyle ?? "other").ToLower();
                if (style.Contains("drum") && style.Contains("bass")) style = "drumandbass";
                else if (style == "edm") style = "electronic";
                else if (style == "hip-hop" || style == "trap" || style == "r&b") style = "hiphop";

                var allowedStyles = new[] { "rock", "pop", "electronic", "hiphop", "jazz", "latin", "metal", "house", "techno", "drumandbass", "other" };
                if (!allowedStyles.Contains(style)) style = "other";

                double? parsedLat = null;
                double? parsedLon = null;
                if (!string.IsNullOrEmpty(model.Latitude) && double.TryParse(model.Latitude.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double lat))
                    parsedLat = lat;
                if (!string.IsNullOrEmpty(model.Longitude) && double.TryParse(model.Longitude.Replace(',', '.'), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double lon))
                    parsedLon = lon;

                double latVal = parsedLat ?? 47.4979;
                double lonVal = parsedLon ?? 19.0402;
                DateTime now = DateTime.Now;

                if (model.IsFeatured)
                {
                    // Ha eddig nem volt kiemelt, de most az akar lenni, akkor ellenőrizzük a korlátot
                    if (!ev.IsFeatured)
                    {
                        var featuredCount = await _context.Events
                            .AsNoTracking()
                            .CountAsync(e => e.IsFeatured && e.EventDateTime.AddHours(2) > now);

                        if (featuredCount >= 3)
                        {
                            return BadRequest("Már van 3 aktív kiemelt esemény. Ahhoz, hogy ezt kiemeld, előbb szüntesd meg egy másik esemény kiemelt státuszát!");
                        }
                    }
                }

                await _context.Database.ExecuteSqlInterpolatedAsync($@"
                    UPDATE events SET 
                        Title = {model.Title}, 
                        Description = {model.Description}, 
                        EventDateTime = {model.EventDateTime}, 
                        Location = POINT({lonVal}, {latVal}), 
                        LocationName = {model.LocationName}, 
                        ImageFileName = {fileName}, 
                        Address = {model.Address}, 
                        TicketPrice = {model.TicketPrice ?? 0}, 
                        MusicStyle = {style}, 
                        MaxAttendees = {model.MaxAttendees}, 
                        IsPublic = {model.IsPublic},
                        IsFeatured = {model.IsFeatured}
                    WHERE EventID = {id}");

                return Ok(new { message = "Esemény sikeresen frissítve!" });
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null) msg += " | " + ex.InnerException.Message;
                // Log stack trace for debugging
                Console.WriteLine($"UpdateEvent Error: {ex.StackTrace}");
                return BadRequest($"Hiba a frissítés során: {msg}");
            }
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                var ev = await _context.Events.FindAsync(id);
                if (ev == null)
                    return NotFound("Az esemény nem található.");

                if (!string.IsNullOrEmpty(ev.ImageFileName) && !ev.ImageFileName.StartsWith("http"))
                {
                    string uploadsFolder = Path.Combine(_env.WebRootPath, "images", "events");
                    var filePath = Path.Combine(uploadsFolder, ev.ImageFileName);
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Events.Remove(ev);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Esemény sikeresen törölve!" });
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null) msg += " | " + ex.InnerException.Message;
                return BadRequest($"Hiba a törlés során: {msg}");
            }
        }
    }
}