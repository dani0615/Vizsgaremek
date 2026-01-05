using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Attendance
{
    public int UserId { get; set; }

    public int EventId { get; set; }

    public DateTime RegisteredAt { get; set; }

    public DateTime? CheckInTime { get; set; }

    public int? PointsEarned { get; set; }

    public string? Status { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
