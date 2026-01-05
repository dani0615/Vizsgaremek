using System;
using System.Collections.Generic;

namespace PartyPulseBackend.Models;

public partial class Chatmessage
{
    public long MessageId { get; set; }

    public Guid RoomId { get; set; }

    public int SenderId { get; set; }

    public string Message { get; set; } = null!;

    public DateTime SentAt { get; set; }

    public bool? IsRead { get; set; }

    public virtual Match Room { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
