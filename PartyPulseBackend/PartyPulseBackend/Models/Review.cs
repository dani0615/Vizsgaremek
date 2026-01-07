using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Table("reviews")]
[Index("EventId", Name = "EventID")]
[Index("UserId", "EventId", Name = "uq_one_review_per_user", IsUnique = true)]
public partial class Review
{
    [Key]
    [Column("ReviewID", TypeName = "int(11)")]
    public int ReviewId { get; set; }

    [Column("EventID", TypeName = "int(11)")]
    public int EventId { get; set; }

    [Column("UserID", TypeName = "int(11)")]
    public int UserId { get; set; }

    [Column(TypeName = "tinyint(4)")]
    public sbyte Rating { get; set; }

    [Column(TypeName = "text")]
    public string? Comment { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("EventId")]
    [InverseProperty("Reviews")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Reviews")]
    public virtual User User { get; set; } = null!;
}
