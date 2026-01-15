using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;

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
        public async Task<IActionResult> GetTopList([FromQuery] string type = "all_time", [FromQuery] int count = 20)
        {
            try
            {
                if (count > 100) count = 100;
                var rawData=await _context.Rankings
                    .Where(r=>r.RankType==type)
                    .OrderByDescending(r=>r.Score)
                    .Take(count)
                    .Select(r => new
                    {
                        UserName=r.User.DisplayName??"Névtelen",
                        Score=r.Score,
                        PartyCount =r.User.Attendances.Count()
                    })
                    .ToListAsync();
                var leaderboard=rawData.Select((item,index)=>new LeaderboardDTO
                {
                    Rank=index+1,
                    UserName=item.UserName,
                    PartyCount=item.PartyCount,
                    Score =item.Score
                }).ToList();
                return Ok(leaderboard);
            }
            catch (Exception ex)
            {

                return BadRequest($"Hiba:{ex.Message}");
            }
        }
    }
}
