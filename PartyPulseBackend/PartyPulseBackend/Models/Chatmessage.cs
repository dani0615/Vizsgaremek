using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Table("chatmessages")]
[Index("RoomId", "SentAt", Name = "idx_room_time")]
[Index("SenderId", Name = "idx_sender")]
[Index("SentAt", Name = "idx_sentat")]
public partial class Chatmessage
{
    [Key]
    [Column("MessageID", TypeName = "bigint(20)")]
    public long MessageId { get; set; }

    [Column("RoomID")]
    public Guid RoomId { get; set; }

    [Column("SenderID", TypeName = "int(11)")]
    public int SenderId { get; set; }

    [Column(TypeName = "text")]
    public string Message { get; set; } = null!;

    [Column(TypeName = "timestamp")]
    public DateTime SentAt { get; set; }

    public bool? IsRead { get; set; }

    [ForeignKey("RoomId")]
    [InverseProperty("Chatmessages")]
    public virtual Match Room { get; set; } = null!;

    [ForeignKey("SenderId")]
    [InverseProperty("Chatmessages")]
    public virtual User Sender { get; set; } = null!;
}
