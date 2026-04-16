using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserID", "EventID")]
[Index("EventID", Name = "EventID")]
public partial class Attendance
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [Key]
    [Column(TypeName = "int(11)")]
    public int EventID { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime RegisteredAt { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? CheckInTime { get; set; }

    [Column(TypeName = "int(11)")]
    public int? PointsEarned { get; set; }

    [Column(TypeName = "enum('going','checked_in','no_show')")]
    public string? Status { get; set; }

    [ForeignKey("EventID")]
    [InverseProperty("Attendances")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserID")]
    [InverseProperty("Attendances")]
    public virtual User User { get; set; } = null!;
}
