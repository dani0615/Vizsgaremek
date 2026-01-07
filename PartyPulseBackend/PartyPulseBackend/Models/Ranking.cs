using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("RankType", "Period", "Score", "UserId")]
[Table("rankings")]
[Index("UserId", Name = "UserID")]
public partial class Ranking
{
    [Key]
    [Column("UserID", TypeName = "int(11)")]
    public int UserId { get; set; }

    [Key]
    [Column(TypeName = "enum('all_time','monthly')")]
    public string RankType { get; set; } = null!;

    [Key]
    [StringLength(7)]
    public string Period { get; set; } = null!;

    [Key]
    [Column(TypeName = "int(11)")]
    public int Score { get; set; }

    [Column(TypeName = "int(11)")]
    public int? RankPos { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Rankings")]
    public virtual User User { get; set; } = null!;
}
