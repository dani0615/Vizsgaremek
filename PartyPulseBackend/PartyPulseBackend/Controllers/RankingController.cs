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

                List<LeaderboardDTO> leaderboard;

                if (type == "all_time")
                {

                    var players = await _context.Users
                        .OrderByDescending(u => u.Points)
                        .Take(count)
                        .Select(u => new
                        {
                            UserId = u.UserID,
                            UserName = u.DisplayName ?? u.Username,
                            Score = u.Points,
                            PartyCount = u.Attendances.Count(),
                            HasProfilePicture = u.ProfilePicture != null,
                            PinnedBadges = u.Userbadges.Where(ub => ub.IsPinned).Select(ub => new BadgeDTO
                            {
                                BadgeID = ub.BadgeID,
                                Name = ub.Badge.Name,
                                Description = ub.Badge.Description,
                                IconUrl = ub.Badge.IconUrl,
                                Criteria = ub.Badge.Criteria,
                                IsEarned = true,
                                AwardedAt = ub.AwardedAt,
                                IsPinned = true
                            }).ToList()
                        })
                        .ToListAsync();

                    leaderboard = players.Select((item, index) => new LeaderboardDTO
                    {
                        UserId = item.UserId,
                        Rank = index + 1,
                        UserName = item.UserName,
                        PartyCount = item.PartyCount,
                        Score = item.Score,
                        ProfilePictureUrl = item.HasProfilePicture ? $"/api/User/avatar/{item.UserId}" : null,
                        PinnedBadges = item.PinnedBadges
                    }).ToList();
                }
                else
                {

                    var rawData = await _context.Rankings
                        .Where(r => r.RankType == type)
                        .OrderByDescending(r => r.Score)
                        .Take(count)
                        .Select(r => new
                        {
                            UserId = r.UserID,
                            UserName = r.User.DisplayName ?? r.User.Username,
                            Score = r.Score,
                            PartyCount = r.User.Attendances.Count(),
                            HasProfilePicture = r.User.ProfilePicture != null,
                            PinnedBadges = r.User.Userbadges.Where(ub => ub.IsPinned).Select(ub => new BadgeDTO
                            {
                                BadgeID = ub.BadgeID,
                                Name = ub.Badge.Name,
                                Description = ub.Badge.Description,
                                IconUrl = ub.Badge.IconUrl,
                                Criteria = ub.Badge.Criteria,
                                IsEarned = true,
                                AwardedAt = ub.AwardedAt,
                                IsPinned = true
                            }).ToList()
                        })
                        .ToListAsync();

                    leaderboard = rawData.Select((item, index) => new LeaderboardDTO
                    {
                        UserId = item.UserId,
                        Rank = index + 1,
                        UserName = item.UserName,
                        PartyCount = item.PartyCount,
                        Score = item.Score,
                        ProfilePictureUrl = item.HasProfilePicture ? $"/api/User/avatar/{item.UserId}" : null,
                        PinnedBadges = item.PinnedBadges
                    }).ToList();
                }

                return Ok(leaderboard);
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba:{ex.Message}");
            }
        }
    }
}
