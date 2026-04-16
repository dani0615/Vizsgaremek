using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.DTOs;
using PartyPulseBackend.Models;
using System.Security.Claims;
using System.Text.Json;

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
        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetUserId();
            var user = await _context.Users
                .Include(u => u.Attendances).ThenInclude(a => a.Event)
                .Include(u => u.Userbadges).ThenInclude(ub => ub.Badge)
                .FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null) return NotFound();

            // Pontok újraszámolása befejezett események után
            var now = DateTime.Now;
            bool pointsChanged = false;
            foreach (var a in user.Attendances)
            {
                if (a.Event.EventDateTime.AddHours(2) < now && (a.PointsEarned ?? 0) < 30)
                {
                    int pointsToAdd = 30 - (a.PointsEarned ?? 0);
                    a.PointsEarned = 30;
                    user.Points += pointsToAdd;
                    pointsChanged = true;
                }
            }

            if (pointsChanged)
            {
                await _context.SaveChangesAsync();
            }

            await CheckAndAwardBadges(user);

            var profile = new UserProfileDTO
            {
                Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Bio = user.Bio,
                Points = user.Points,
                Role = user.Role,
                ProfilePictureUrl = user.ProfilePicture != null ? $"/api/User/avatar/{userId}" : null,
                Gender = user.Gender,
                BirthDate = user.BirthDate.HasValue ? user.BirthDate.Value.ToDateTime(TimeOnly.MinValue) : null,
                LookingFor = user.LookingFor,
                LastModified = user.UpdatedAt,
                Badges = user.Userbadges.Select(ub => new BadgeDTO
                {
                    BadgeID = ub.BadgeID,
                    Name = ub.Badge.Name,
                    Description = ub.Badge.Description,
                    IconUrl = ub.Badge.IconUrl,
                    Criteria = ub.Badge.Criteria,
                    IsEarned = true,
                    AwardedAt = ub.AwardedAt,
                    IsPinned = ub.IsPinned
                }).ToList()
            };
            return Ok(profile);
        }


        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO model)
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (user.Email != model.Email && await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest("Ez az email cím már használatban van.");
            }
            user.Email = model.Email;
            user.DisplayName = model.DisplayName;
            user.Bio = model.Bio;
            user.Gender = model.Gender;
            user.BirthDate = model.BirthDate.HasValue ? DateOnly.FromDateTime(model.BirthDate.Value) : null;
            user.LookingFor = model.LookingFor;
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Profil sikeresen frissítve.");

        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            var userId = GetUserId();
            var user = await _context.Users.Include(u => u.Passwordsalt).FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null || user.Passwordsalt == null) return NotFound();

            string oldHash = Program.CreateSHA256(model.OldPassword + user.Passwordsalt.Salt);
            if (oldHash != user.Passwordsalt.PasswordHash)
            {
                return BadRequest("A jelenlegi jelszó hibás");
            }
            string newSalt = Program.GenerateSalt();
            user.Passwordsalt.Salt = newSalt;
            user.Passwordsalt.PasswordHash = Program.CreateSHA256(model.NewPassword + newSalt);
            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Jelszó sikeresen megváltoztatva.");
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] AvatarUploadDTO model)
        {
            var file = model.File;
            if (file == null || file.Length == 0) return BadRequest("Nincs kiválasztva fájl.");

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
            {
                return BadRequest("Csak JPEG, PNG és GIF fájlok engedélyezettek.");
            }

            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            using (var memorySteam = new MemoryStream())
            {
                await file.CopyToAsync(memorySteam);
                user.ProfilePicture = memorySteam.ToArray();
                user.ProfilePictureMime = file.ContentType;
                user.UpdatedAt = DateTime.Now;
            }
            await _context.SaveChangesAsync();
            return Ok(new { url = $"/api/User/avatar/{userId}" });

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

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return Ok(new List<object>());
            var currentUserId = GetUserId();
            var users = await _context.Users
                .Where(u => u.UserID != currentUserId && (u.Username.Contains(q) || (u.DisplayName != null && u.DisplayName.Contains(q))))
                .Select(u => new
                {
                    u.UserID,
                    u.Username,
                    Name = u.DisplayName ?? u.Username,
                    ProfilePictureBase64 = u.ProfilePicture != null && u.ProfilePictureMime != null
                        ? $"data:{u.ProfilePictureMime};base64,{Convert.ToBase64String(u.ProfilePicture)}"
                        : null
                })
                .Take(20)
                .ToListAsync();
            return Ok(users);
        }

        private async Task CheckAndAwardBadges(User user)
        {
            var allActiveBadges = await _context.Badges.Where(b => b.IsActive == true).ToListAsync();
            var userBadgeIds = user.Userbadges.Select(ub => ub.BadgeID).ToHashSet();
            
            bool newBadgeAwarded = false;
            var now = DateTime.Now;

            foreach(var badge in allActiveBadges)
            {
                if (userBadgeIds.Contains(badge.BadgeID)) continue;

                bool isEligible = false;
                try 
                {
                    var criteriaDoc = JsonDocument.Parse(badge.Criteria);
                    var root = criteriaDoc.RootElement;
                    if (root.TryGetProperty("type", out var typeElement))
                    {
                        string type = typeElement.GetString()!;
                        if (type == "registration")
                        {
                            isEligible = true;
                        }
                        else if (type == "attendance")
                        {
                            if (root.TryGetProperty("min", out var minElement))
                            {
                                int min = minElement.GetInt32();
                                int attendanceCount = user.Attendances.Count(a => a.PointsEarned > 0 || a.Event.EventDateTime < now);
                                if (attendanceCount >= min) isEligible = true;
                            }
                        }
                        else if (type == "age")
                        {
                            if (root.TryGetProperty("months", out var monthsElement))
                            {
                                int months = monthsElement.GetInt32();
                                if (user.CreatedAt.AddMonths(months) <= now) isEligible = true;
                            }
                            else if (root.TryGetProperty("years", out var yearsElement))
                            {
                                int years = yearsElement.GetInt32();
                                if (user.CreatedAt.AddYears(years) <= now) isEligible = true;
                            }
                        }
                    }
                }
                catch { /* Ignore parsing errors */ }

                if (isEligible)
                {
                    user.Userbadges.Add(new UserBadge 
                    {
                        UserID = user.UserID,
                        BadgeID = badge.BadgeID,
                        AwardedAt = now
                    });
                    newBadgeAwarded = true;
                }
            }

            if (newBadgeAwarded)
            {
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost("pin-badges")]
        public async Task<IActionResult> PinBadges([FromBody] List<int> badgeIds)
        {
            if (badgeIds != null && badgeIds.Count > 3)
            {
                return BadRequest("Maximum 3 jelvény tűzhető ki.");
            }

            var userId = GetUserId();
            var userBadges = await _context.Userbadges.Where(ub => ub.UserID == userId).ToListAsync();

            foreach (var ub in userBadges)
            {
                ub.IsPinned = badgeIds != null && badgeIds.Contains(ub.BadgeID);
            }

            await _context.SaveChangesAsync();
            return Ok("Kitűzött jelvények mentve.");
        }
    }
}
