using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using System.Security.Claims;

namespace PartyPulseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BadgeController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public BadgeController(PartyPulseContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBadges()
        {
            var userId = GetUserId();
            
            // Lekérjük az összes aktív jelvényt
            var allBadges = await _context.Badges
                .Where(b => b.IsActive == true)
                .ToListAsync();

            // Lekérjük a felhasználó által már megszerzett jelvényeket
            var userBadgeIds = await _context.Userbadges
                .Where(ub => ub.UserID == userId)
                .Select(ub => ub.BadgeID)
                .ToListAsync();

            var badgeDTOs = allBadges.Select(b => new BadgeDTO
            {
                BadgeID = b.BadgeID,
                Name = b.Name,
                Description = b.Description,
                IconUrl = b.IconUrl,
                Criteria = b.Criteria,
                IsEarned = userBadgeIds.Contains(b.BadgeID)
            }).ToList();

            return Ok(badgeDTOs);
        }
    }
}
