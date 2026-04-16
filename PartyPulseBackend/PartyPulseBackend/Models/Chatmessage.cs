using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("MatchID", "SentAt", Name = "idx_match_time")]
[Index("SenderID", Name = "idx_sender")]
[Index("SentAt", Name = "idx_sentat")]
[MySqlCollation("utf8mb4_unicode_ci")]
public partial class Chatmessage
{
    [Key]
    [Column(TypeName = "bigint(20)")]
    public long MessageID { get; set; }

    [Column(TypeName = "int(11)")]
    public int MatchID { get; set; }

    [Column(TypeName = "int(11)")]
    public int SenderID { get; set; }

    [Column(TypeName = "text")]
    public string EncryptedMessage { get; set; } = null!;

    [StringLength(64)]
    public string EncryptionIV { get; set; } = null!;

    [Column(TypeName = "timestamp")]
    public DateTime SentAt { get; set; }

    public bool? IsRead { get; set; }

    [ForeignKey("MatchID")]
    [InverseProperty("Chatmessages")]
    public virtual Match Match { get; set; } = null!;

    [ForeignKey("SenderID")]
    [InverseProperty("Chatmessages")]
    public virtual User Sender { get; set; } = null!;
}
