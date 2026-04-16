using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserID", "EventID")]
[Index("EventID", Name = "idx_event")]
[Index("UserID", Name = "idx_user")]
[MySqlCollation("utf8mb4_unicode_ci")]
public partial class Eventfavorite
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [Key]
    [Column(TypeName = "int(11)")]
    public int EventID { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("EventID")]
    [InverseProperty("Eventfavorites")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserID")]
    [InverseProperty("Eventfavorites")]
    public virtual User User { get; set; } = null!;
}
