using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Event
{
    public int EventId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime EventDateTime { get; set; }

    public string? LocationName { get; set; }

    public string? Address { get; set; }

    public decimal? TicketPrice { get; set; }

    public int OrganizerId { get; set; }

    public string MusicStyle { get; set; } = null!;

    public int? MaxAttendees { get; set; }

    public bool? IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual User Organizer { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
