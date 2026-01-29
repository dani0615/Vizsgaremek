using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("ChatRoomID", Name = "ChatRoomID", IsUnique = true)]
[Index("User2ID", Name = "User2ID")]
[Index("User1ID", "User2ID", Name = "uq_pair", IsUnique = true)]
public partial class match
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

    [Required]
    public Guid? ChatRoomID { get; set; }

    [ForeignKey("User1ID")]
    [InverseProperty("matchUser1s")]
    public virtual user User1 { get; set; } = null!;

    [ForeignKey("User2ID")]
    [InverseProperty("matchUser2s")]
    public virtual user User2 { get; set; } = null!;

    [InverseProperty("Room")]
    public virtual ICollection<chatmessage> chatmessages { get; set; } = new List<chatmessage>();
}
