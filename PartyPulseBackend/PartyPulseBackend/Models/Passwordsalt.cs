using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Passwordsalt
{
    public int UserId { get; set; }

    public string Salt { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
