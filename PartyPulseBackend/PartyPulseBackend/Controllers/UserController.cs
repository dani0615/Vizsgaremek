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
                ProfilePictureUrl =user.ProfilePicture != null ? $"/api/User/avatar/{userId}":null,
                Gender = user.Gender,
                BirthDate = user.BirthDate,
                LookingFor = user.LookingFor
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
            user.Gender = model.Gender;
            user.BirthDate = model.BirthDate;
            user.LookingFor = model.LookingFor;
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Profil sikeresen frissítve.");

        }
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var userId = GetUserId();
            var user = await _context.Users.Include(u=>u.passwordsalt).FirstOrDefaultAsync(u=>u.UserID==userId);

            if (user == null || user.passwordsalt==null) return NotFound();

            string oldHash=Program.CreateSHA256(model.OldPassword+user.passwordsalt.Salt);
            if(oldHash != user.passwordsalt.PasswordHash)
            {
                return BadRequest("A jelenlegi jelszó hibás");
            }
            string newSalt = Program.GenerateSalt();
            user.passwordsalt.Salt = newSalt;
            user.passwordsalt.PasswordHash = Program.CreateSHA256(model.NewPassword + newSalt);
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Jelszó sikeresen megváltoztatva.");
        }
        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
          if(file==null|| file.Length == 0) return BadRequest("Nincs kiválasztva fájl.");

          var allowedTypes=new[] { "image/jpeg", "image/png", "image/gif" };
            if(!allowedTypes.Contains(file.ContentType))
            {
                return BadRequest("Csak JPEG, PNG és GIF fájlok engedélyezettek.");
            }

            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if(user == null) return NotFound();

            using(var memorySteam= new MemoryStream())
            {
                await file.CopyToAsync(memorySteam);
                user.ProfilePicture = memorySteam.ToArray();
                user.ProfilePictureMime = file.ContentType;
                user.UpdatedAt = DateTime.Now;
            }
            await _context.SaveChangesAsync();
            return Ok(new {url=$"/api/User/avatar/{userId}"});

        }
        [AllowAnonymous]
        [HttpGet("avatar/{id}")]
        public async Task<IActionResult> GetAvatar(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.ProfilePicture == null)
            {
                return NotFound();
            }
            return File(user.ProfilePicture, user.ProfilePictureMime ?? "image/jpeg");
        }
    }
}
