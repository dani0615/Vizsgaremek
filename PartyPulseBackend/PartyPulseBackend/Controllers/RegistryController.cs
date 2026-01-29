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
    public class RegistryController : ControllerBase
    {
        private readonly PartyPulseContext _context;

        public RegistryController(PartyPulseContext context)
        {
            _context = context;
        }

       
        [HttpPost]
        public async Task<IActionResult> Registry([FromBody] UserRegistrationDTO regModel)
        {
            user newUser; 

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (await _context.Users.AnyAsync(u => u.Username == regModel.Username))
                        return BadRequest("Felhasználónév már foglalt.");

                    if (await _context.Users.AnyAsync(u => u.Email == regModel.Email))
                        return BadRequest("Email cím már foglalt.");

                    newUser = new user
                    {
                        Username = regModel.Username,
                        Email = regModel.Email,
                        IsActive = false,
                        IsVerified = false,
                        Role = "user",
                        Points = 0,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };

                    await _context.Users.AddAsync(newUser);
                    await _context.SaveChangesAsync();

                    string salt = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 32);
                    string passwordHash = Program.CreateSHA256(regModel.Password + salt);

                    var passwordEntry = new passwordsalt
                    {
                        UserID = newUser.UserID,
                        Salt = salt,
                        PasswordHash = passwordHash,
                        CreatedAt = DateTime.Now
                    };

                    await _context.Passwordsalts.AddAsync(passwordEntry);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync(); 
                }
                catch (Exception ex)
                {
                   
                    await transaction.RollbackAsync();
                    return BadRequest($"Adatbázis hiba: {ex.Message}");
                }
            }

            
            try
            {
                string confirmationLink = $"https://localhost:7234/api/Registry?felhasznalonev={newUser.Username}&email={newUser.Email}";
                await Program.SendEmail(newUser.Email, "Regisztráció megerősítése",
                    $"Szia {newUser.Username}! Kattints ide a megerősítéshez: {confirmationLink}");

                return Ok("Sikeres regisztráció, kérjük erősítse meg emailben!");
            }
            catch (Exception ex)
            {
                
                return Ok($"Sikeres regisztráció, de az email küldése sikertelen volt. Hiba: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> ConfirmRegistry(string felhasznalonev, string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == felhasznalonev && u.Email == email);

                if (user == null)
                    return BadRequest("Érvénytelen adatok.");

                if ((bool)user.IsActive)
                    return Ok("A fiók már korábban aktiválva lett.");

                
                user.IsActive = true;
                user.IsVerified = true;
                user.Role = "user"; 

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok("Sikeres regisztráció megerősítés. Most már bejelentkezhet!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}