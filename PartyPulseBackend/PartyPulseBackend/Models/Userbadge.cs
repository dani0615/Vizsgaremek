using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Userbadge
{
    public int UserId { get; set; }

    public int BadgeId { get; set; }

    public DateTime AwardedAt { get; set; }

    public virtual Badge Badge { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
