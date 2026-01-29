using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

public partial class passwordsalt
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
    [InverseProperty("passwordsalt")]
    public virtual user User { get; set; } = null!;
}
