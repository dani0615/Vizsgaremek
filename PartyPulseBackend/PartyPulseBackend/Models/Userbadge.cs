using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserID", "BadgeID")]
[Index("BadgeID", Name = "BadgeID")]
public partial class UserBadge
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [Key]
    [Column(TypeName = "int(11)")]
    public int BadgeID { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime AwardedAt { get; set; }

    public bool IsPinned { get; set; }

    public virtual Badge Badge { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
