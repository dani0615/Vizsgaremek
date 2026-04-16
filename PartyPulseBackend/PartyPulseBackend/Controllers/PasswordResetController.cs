using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using PartyPulseBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace PartyPulseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly PartyPulseContext _context;
        private readonly IConfiguration _config;

        public PasswordResetController(PartyPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("Forgot")]
        public async Task<IActionResult> Forgot([FromBody] ForgotPasswordDTO model)
        {
            var user = await _context.Users
                .Include(u => u.Passwordsalt)
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
            {
                // Biztonsági okokból ne áruljuk el, ha nincs ilyen email, 
                // de a fejlesztés során/visszajelzésben hasznos lehet.
                // Élesben: return Ok("Ha az email cím létezik, elküldtük az utasításokat.");
                return Ok(new { message = "Ha az email cím létezik a rendszerünkben, elküldtük a jelszó visszaállítási linket." });
            }

            // Expiráció: 15 perc
            var expiry = DateTime.UtcNow.AddMinutes(15).Ticks.ToString();
            var token = GenerateResetToken(user.Email, user.Passwordsalt!.PasswordHash, expiry);

            try
            {
                string origin = Request.Headers["Origin"].ToString();
                if (string.IsNullOrEmpty(origin))
                {
                    origin = "http://localhost:5173";
                }

                // A token tartalmazza az expirációt is base64-ben kódolva vagy separátorral
                var combinedToken = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{expiry}|{token}"));
                string resetLink = $"{origin}/reset-password?token={combinedToken}&email={Uri.EscapeDataString(user.Email)}";

                await Program.SendEmail(user.Email, "Jelszó visszaállítás",
                    $"Szia {user.Username}!\n\nKértél egy jelszó visszaállítást a Party Pulse fiókodhoz. Kattints az alábbi linkre a folytatáshoz (15 percig érvényes):\n\n{resetLink}\n\nHa nem te kérted a visszaállítást, hagyd figyelmen kívül ezt az üzenetet.");

                return Ok(new { message = "A jelszó visszaállítási linket elküldtük." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba az email küldése során: {ex.Message}");
            }
        }

        [HttpPost("Reset")]
        public async Task<IActionResult> Reset([FromBody] ResetPasswordDTO model)
        {
            var user = await _context.Users
                .Include(u => u.Passwordsalt)
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null) return BadRequest("Érvénytelen kérés.");

            try
            {
                var decodedToken = Encoding.UTF8.GetString(Convert.FromBase64String(model.Token));
                var parts = decodedToken.Split('|');
                if (parts.Length != 2) return BadRequest("Érvénytelen token formátum.");

                var expiryTicks = long.Parse(parts[0]);
                var providedToken = parts[1];

                if (DateTime.UtcNow.Ticks > expiryTicks)
                {
                    return BadRequest("A jelszó visszaállítási link lejárt.");
                }

                var expectedToken = GenerateResetToken(user.Email, user.Passwordsalt!.PasswordHash, expiryTicks.ToString());

                if (providedToken != expectedToken)
                {
                    return BadRequest("Érvénytelen vagy lejárt jelszó visszaállítási link.");
                }

                // Új jelszó beállítása
                string newSalt = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 32);
                string newHash = Program.CreateSHA256(model.NewPassword + newSalt);

                user.Passwordsalt.Salt = newSalt;
                user.Passwordsalt.PasswordHash = newHash;
                user.Passwordsalt.CreatedAt = DateTime.Now;
                user.UpdatedAt = DateTime.Now;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "A jelszó sikeresen megváltoztatva!" });
            }
            catch
            {
                return BadRequest("Hiba a token feldolgozása során.");
            }
        }

        private string GenerateResetToken(string email, string currentHash, string expiry)
        {
            var secret = _config["JwtSettings:SecretKey"] ?? "FallbackSecretKeyForResetTokens";
            var payload = $"{email}:{currentHash}:{expiry}";

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return Convert.ToBase64String(hash);
        }
    }
}