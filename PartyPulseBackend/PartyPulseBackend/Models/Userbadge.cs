using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserId", "BadgeId")]
[Table("userbadges")]
[Index("BadgeId", Name = "BadgeID")]
public partial class Userbadge
{
    [Key]
    [Column("UserID", TypeName = "int(11)")]
    public int UserId { get; set; }

    [Key]
    [Column("BadgeID", TypeName = "int(11)")]
    public int BadgeId { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime AwardedAt { get; set; }

    [ForeignKey("BadgeId")]
    [InverseProperty("Userbadges")]
    public virtual Badge Badge { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Userbadges")]
    public virtual User User { get; set; } = null!;
}
