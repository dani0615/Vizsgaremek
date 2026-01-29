using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("RoomID", "SentAt", Name = "idx_room_time")]
[Index("SenderID", Name = "idx_sender")]
[Index("SentAt", Name = "idx_sentat")]
public partial class chatmessage
{
    [Key]
    [Column(TypeName = "bigint(20)")]
    public long MessageID { get; set; }

    public Guid RoomID { get; set; }

    [Column(TypeName = "int(11)")]
    public int SenderID { get; set; }

    [Column(TypeName = "text")]
    public string Message { get; set; } = null!;

    [Column(TypeName = "timestamp")]
    public DateTime SentAt { get; set; }

    public bool? IsRead { get; set; }

    [ForeignKey("RoomID")]
    [InverseProperty("chatmessages")]
    public virtual match Room { get; set; } = null!;

    [ForeignKey("SenderID")]
    [InverseProperty("chatmessages")]
    public virtual user Sender { get; set; } = null!;
}
