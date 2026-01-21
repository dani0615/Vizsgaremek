using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class UserController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        public UserController(PartyPulseContext context)
        {
            _context = context;
        }
        private int GetUserId()=>int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

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
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO model)
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if(user.Email != model.Email && await _context.Users.AnyAsync(u=>u.Email==model.Email))
            {
              return BadRequest("Ez az email cím már használatban van.");
            }
            user.Email = model.Email;
            user.DisplayName = model.DisplayName;
            user.Bio = model.Bio;
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Profil sikeresen frissítve.");

        }
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var userId = GetUserId();
            var user = await _context.Users.Include(u=>u.Passwordsalt).FirstOrDefaultAsync(u=>u.UserId==userId);

            if (user == null || user.Passwordsalt==null) return NotFound();

            string oldHash=Program.CreateSHA256(model.OldPassword+user.Passwordsalt.Salt);
            if(oldHash != user.Passwordsalt.PasswordHash)
            {
                return BadRequest("A jelenlegi jelszó hibás");
            }

        }
    }
}
