using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
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
