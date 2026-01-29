using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserID", "BadgeID")]
[Index("BadgeID", Name = "BadgeID")]
public partial class userbadge
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [Key]
    [Column(TypeName = "int(11)")]
    public int BadgeID { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime AwardedAt { get; set; }

    [ForeignKey("BadgeID")]
    [InverseProperty("userbadges")]
    public virtual badge Badge { get; set; } = null!;

    [ForeignKey("UserID")]
    [InverseProperty("userbadges")]
    public virtual user User { get; set; } = null!;
}
