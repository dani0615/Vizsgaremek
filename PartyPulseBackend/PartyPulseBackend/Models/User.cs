using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("Email", Name = "Email", IsUnique = true)]
[Index("Username", Name = "Username", IsUnique = true)]
[Index("Email", Name = "idx_email")]
[Index("LastActive", Name = "idx_lastactive")]
[Index("Points", Name = "idx_points")]
[Index("Username", Name = "idx_username")]
public partial class user
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

    [Column(TypeName = "date")]
    public DateTime? BirthDate { get; set; }

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
    public virtual ICollection<attendance> attendances { get; set; } = new List<attendance>();

    [InverseProperty("Sender")]
    public virtual ICollection<chatmessage> chatmessages { get; set; } = new List<chatmessage>();

    [InverseProperty("User")]
    public virtual ICollection<eventfavorite> eventfavorites { get; set; } = new List<eventfavorite>();

    [InverseProperty("Organizer")]
    public virtual ICollection<@event> events { get; set; } = new List<@event>();

    [InverseProperty("User1")]
    public virtual ICollection<match> matchUser1s { get; set; } = new List<match>();

    [InverseProperty("User2")]
    public virtual ICollection<match> matchUser2s { get; set; } = new List<match>();

    [InverseProperty("User")]
    public virtual passwordsalt? passwordsalt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<ranking> rankings { get; set; } = new List<ranking>();

    [InverseProperty("User")]
    public virtual ICollection<review> reviews { get; set; } = new List<review>();

    [InverseProperty("User")]
    public virtual ICollection<userbadge> userbadges { get; set; } = new List<userbadge>();
}
