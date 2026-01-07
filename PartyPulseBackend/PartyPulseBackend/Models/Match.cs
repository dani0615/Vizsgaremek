using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Table("matches")]
[Index("ChatRoomId", Name = "ChatRoomID", IsUnique = true)]
[Index("User2Id", Name = "User2ID")]
[Index("User1Id", "User2Id", Name = "uq_pair", IsUnique = true)]
public partial class Match
{
    [Key]
    [Column("MatchID", TypeName = "int(11)")]
    public int MatchId { get; set; }

    [Column("User1ID", TypeName = "int(11)")]
    public int User1Id { get; set; }

    [Column("User2ID", TypeName = "int(11)")]
    public int User2Id { get; set; }

    public bool? User1Liked { get; set; }

    public bool? User2Liked { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? MatchedAt { get; set; }

    [Required]
    [Column("ChatRoomID")]
    public Guid? ChatRoomId { get; set; }

    [InverseProperty("Room")]
    public virtual ICollection<Chatmessage> Chatmessages { get; set; } = new List<Chatmessage>();

    [ForeignKey("User1Id")]
    [InverseProperty("MatchUser1s")]
    public virtual User User1 { get; set; } = null!;

    [ForeignKey("User2Id")]
    [InverseProperty("MatchUser2s")]
    public virtual User User2 { get; set; } = null!;
}
