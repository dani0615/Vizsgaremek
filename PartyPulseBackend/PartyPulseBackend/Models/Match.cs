using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("ChatRoomID", Name = "ChatRoomID", IsUnique = true)]
[Index("User2ID", Name = "User2ID")]
[Index("User1ID", "User2ID", Name = "uq_pair", IsUnique = true)]
[MySqlCollation("utf8mb4_unicode_ci")]
public partial class Match
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int MatchID { get; set; }

    [Column(TypeName = "int(11)")]
    public int User1ID { get; set; }

    [Column(TypeName = "int(11)")]
    public int User2ID { get; set; }

    public bool? User1Liked { get; set; }

    public bool? User2Liked { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? MatchedAt { get; set; }

    public bool User1Seen { get; set; }

    public bool User2Seen { get; set; }

    public Guid? ChatRoomID { get; set; }

    [ForeignKey("User1ID")]
    [InverseProperty("MatchUser1s")]
    public virtual User User1 { get; set; } = null!;

    [ForeignKey("User2ID")]
    [InverseProperty("MatchUser2s")]
    public virtual User User2 { get; set; } = null!;

    [InverseProperty("Match")]
    public virtual ICollection<Chatmessage> Chatmessages { get; set; } = new List<Chatmessage>();
}
