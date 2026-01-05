using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Match
{
    public int MatchId { get; set; }

    public int User1Id { get; set; }

    public int User2Id { get; set; }

    public bool? User1Liked { get; set; }

    public bool? User2Liked { get; set; }

    public DateTime? MatchedAt { get; set; }

    public Guid? ChatRoomId { get; set; }

    public virtual ICollection<Chatmessage> Chatmessages { get; set; } = new List<Chatmessage>();

    public virtual User User1 { get; set; } = null!;

    public virtual User User2 { get; set; } = null!;
}
