using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("Name", Name = "Name", IsUnique = true)]
public partial class Badge
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int BadgeID { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [StringLength(512)]
    public string? IconUrl { get; set; }

    [Column(TypeName = "json")]
    public string Criteria { get; set; } = null!;

    public bool? IsActive { get; set; }

    public virtual ICollection<UserBadge> Userbadges { get; set; } = new List<UserBadge>();
}
