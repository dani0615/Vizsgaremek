using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("Email", Name = "Email", IsUnique = true)]
[Index("LastActive", Name = "idx_lastactive")]
[Index("Points", Name = "idx_points")]
[Index("Username", Name = "idx_username", IsUnique = true)]
[MySqlCollation("utf8mb4_unicode_ci")]
public partial class User
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [StringLength(50)]
    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    [Column(TypeName = "enum('user','organizer','admin')")]
    public string Role { get; set; } = null!;

    [StringLength(100)]
    public string? DisplayName { get; set; }

    [Column(TypeName = "text")]
    public string? Bio { get; set; }

    public byte[]? ProfilePicture { get; set; }

    [StringLength(30)]
    public string? ProfilePictureMime { get; set; }

    [Column(TypeName = "int(11)")]
    public int Points { get; set; }

    [Column(TypeName = "enum('male','female','other','prefer_not_to_say')")]
    public string? Gender { get; set; }

    public DateOnly? BirthDate { get; set; }

    [Column(TypeName = "enum('friends','party_buddies','both')")]
    public string? LookingFor { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsVerified { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? LastActive { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    [InverseProperty("Sender")]
    public virtual ICollection<Chatmessage> Chatmessages { get; set; } = new List<Chatmessage>();

    [InverseProperty("User")]
    public virtual ICollection<Eventfavorite> Eventfavorites { get; set; } = new List<Eventfavorite>();

    [InverseProperty("Organizer")]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    [InverseProperty("User1")]
    public virtual ICollection<Match> MatchUser1s { get; set; } = new List<Match>();

    [InverseProperty("User2")]
    public virtual ICollection<Match> MatchUser2s { get; set; } = new List<Match>();

    [InverseProperty("User")]
    public virtual Passwordsalt? Passwordsalt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Ranking> Rankings { get; set; } = new List<Ranking>();

    [InverseProperty("User")]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<UserBadge> Userbadges { get; set; } = new List<UserBadge>();
}
