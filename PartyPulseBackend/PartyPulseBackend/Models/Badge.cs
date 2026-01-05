using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Badge
{
    public int BadgeId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? IconUrl { get; set; }

    public string Criteria { get; set; } = null!;

    public bool? IsActive { get; set; }

    public virtual ICollection<Userbadge> Userbadges { get; set; } = new List<Userbadge>();
}
