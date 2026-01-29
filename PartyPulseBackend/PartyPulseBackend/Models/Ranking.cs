using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("RankType", "Period", "Score", "UserID")]
[Index("UserID", Name = "UserID")]
public partial class ranking
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

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

    [ForeignKey("UserID")]
    [InverseProperty("rankings")]
    public virtual user User { get; set; } = null!;
}
