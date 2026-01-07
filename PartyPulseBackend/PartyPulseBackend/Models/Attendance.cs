using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[PrimaryKey("UserId", "EventId")]
[Table("attendances")]
[Index("EventId", Name = "EventID")]
public partial class Attendance
{
    [Key]
    [Column("UserID", TypeName = "int(11)")]
    public int UserId { get; set; }

    [Key]
    [Column("EventID", TypeName = "int(11)")]
    public int EventId { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime RegisteredAt { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? CheckInTime { get; set; }

    [Column(TypeName = "int(11)")]
    public int? PointsEarned { get; set; }

    [Column(TypeName = "enum('going','checked_in','no_show')")]
    public string? Status { get; set; }

    [ForeignKey("EventId")]
    [InverseProperty("Attendances")]
    public virtual Event Event { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Attendances")]
    public virtual User User { get; set; } = null!;
}
