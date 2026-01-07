using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Table("passwordsalts")]
public partial class Passwordsalt
{
    [Key]
    [Column("UserID", TypeName = "int(11)")]
    public int UserId { get; set; }

    [StringLength(32)]
    public string Salt { get; set; } = null!;

    [StringLength(64)]
    public string PasswordHash { get; set; } = null!;

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Passwordsalt")]
    public virtual User User { get; set; } = null!;
}
