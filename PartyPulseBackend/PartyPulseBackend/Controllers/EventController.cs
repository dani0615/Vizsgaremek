using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly PartyPulseContext_context;

        public EventController(PartyPulseContext context)
        {
            _context = context;
        }
        [HttpGet("AllEvents")]
        public IActionResult GetAllEvents()
        {
            try
            {

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
