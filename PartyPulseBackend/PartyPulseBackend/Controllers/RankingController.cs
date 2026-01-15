using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PartyPulseBackend.Data;

namespace PartyPulseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public RankingController(PartyPulseContext context)
        {
            _context = context;
        }

        [HttpGet("TopList")]
    }
}
