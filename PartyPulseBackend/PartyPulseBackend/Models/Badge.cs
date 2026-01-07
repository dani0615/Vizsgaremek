using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Table("badges")]
[Index("Name", Name = "Name", IsUnique = true)]
public partial class Badge
{
    [Key]
    [Column("BadgeID", TypeName = "int(11)")]
    public int BadgeId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [StringLength(512)]
    public string? IconUrl { get; set; }

    public string Criteria { get; set; } = null!;

    public bool? IsActive { get; set; }

    [InverseProperty("Badge")]
    public virtual ICollection<Userbadge> Userbadges { get; set; } = new List<Userbadge>();
}
