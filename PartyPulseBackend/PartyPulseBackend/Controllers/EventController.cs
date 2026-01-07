using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public EventController(PartyPulseContext context)
        {
            _context = context;
        }
        [HttpGet("AllEvents")]
        public async Task<IActionResult> GetAllEvents()
        {
            try
            {
                var events =await _context.Events.Select(e=>new EventDTO
                {
                    Title = e.Title,
                    Description = e.Description,
                    EventDateTime = e.EventDateTime,
                    Address = e.Address,
                    LocationName = e.LocationName
                })
                    .ToListAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba az események betöltésekor: {ex.Message}");
            }
        }
    }
}
