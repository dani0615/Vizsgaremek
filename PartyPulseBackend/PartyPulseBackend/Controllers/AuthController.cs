using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PartyPulseBackend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        private readonly IConfiguration _config;

        public AuthController(PartyPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginModel)
        {

            var user = await _context.Users
                .Include(u => u.Passwordsalt)
                .FirstOrDefaultAsync(u => u.Email == loginModel.Identifier || u.Username == loginModel.Identifier);

            if (user == null)
                return Unauthorized("Hibás felhasználónév/email vagy jelszó.");


            if (user.IsActive != true)
                return BadRequest("Kérjük, előbb erősítse meg az email címét!");


            string salt = user.Passwordsalt!.Salt;
            string computedHash = Program.CreateSHA256(loginModel.Password + salt);

            if (computedHash != user.Passwordsalt.PasswordHash)
                return Unauthorized("Hibás felhasználónév/email vagy jelszó.");


            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token = token,
                userId = user.UserID,
                username = user.Username,
                role = user.Role,
                displayName = user.DisplayName,
                profilePictureBase64 = user.ProfilePicture != null && user.ProfilePictureMime != null
                    ? $"data:{user.ProfilePictureMime};base64,{Convert.ToBase64String(user.ProfilePicture)}"
                    : null
            });
        }

        private string GenerateJwtToken(Models.User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}