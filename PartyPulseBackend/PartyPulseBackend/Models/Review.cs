using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("EventID", Name = "EventID")]
[Index("UserID", "EventID", Name = "uq_one_review_per_user", IsUnique = true)]
[MySqlCollation("utf8mb4_unicode_ci")]
public partial class Review
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int ReviewID { get; set; }

    [Column(TypeName = "int(11)")]
    public int EventID { get; set; }

    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [Column(TypeName = "tinyint(4)")]
    public sbyte Rating { get; set; }

    [Column(TypeName = "text")]
    public string? Comment { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("EventID")]
    [InverseProperty("Reviews")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserID")]
    [InverseProperty("Reviews")]
    public virtual User User { get; set; } = null!;
}
