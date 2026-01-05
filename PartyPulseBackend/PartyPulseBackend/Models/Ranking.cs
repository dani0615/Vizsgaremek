using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Ranking
{
    public int UserId { get; set; }

    public string RankType { get; set; } = null!;

    public string Period { get; set; } = null!;

    public int Score { get; set; }

    public int? RankPos { get; set; }

    public virtual User User { get; set; } = null!;
}
