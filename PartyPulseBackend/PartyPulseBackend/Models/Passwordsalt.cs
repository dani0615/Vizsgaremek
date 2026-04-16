using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

public partial class Passwordsalt
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int UserID { get; set; }

    [StringLength(64)]
    public string Salt { get; set; } = null!;

    [StringLength(64)]
    public string PasswordHash { get; set; } = null!;

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("UserID")]
    [InverseProperty("Passwordsalt")]
    public virtual User User { get; set; } = null!;
}
