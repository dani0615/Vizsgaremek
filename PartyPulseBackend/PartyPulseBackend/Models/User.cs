using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? DisplayName { get; set; }

    public string? Bio { get; set; }

    public byte[]? ProfilePicture { get; set; }

    public string? ProfilePictureMime { get; set; }

    public int Points { get; set; }

    public string? Gender { get; set; }

    public DateTime? BirthDate { get; set; }

    public string? LookingFor { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsVerified { get; set; }

    public DateTime? LastActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Chatmessage> Chatmessages { get; set; } = new List<Chatmessage>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Match> MatchUser1s { get; set; } = new List<Match>();

    public virtual ICollection<Match> MatchUser2s { get; set; } = new List<Match>();

    public virtual Passwordsalt? Passwordsalt { get; set; }

    public virtual ICollection<Ranking> Rankings { get; set; } = new List<Ranking>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Userbadge> Userbadges { get; set; } = new List<Userbadge>();
}
