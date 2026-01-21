using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;

namespace PartyPulseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        public UserController(PartyPulseContext context)
        {
            _context = context;
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            var profile = new UserProfileDTO
            {
                Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                Points = user.Points,
                Role = user.Role,
                ProfilePictureUrl =user.ProfilePicture != null ? $"/api/User/avatar/{userId}":null
            };
            return Ok(profile);
        }
    }
}
