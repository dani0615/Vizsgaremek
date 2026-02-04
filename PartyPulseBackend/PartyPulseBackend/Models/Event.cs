using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

[Index("OrganizerID", Name = "OrganizerID")]
[Index("Title", "Description", Name = "ft_search")]
[Index("EventDateTime", Name = "idx_datetime")]
[Index("MusicStyle", Name = "idx_music")]
public partial class @event
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int EventID { get; set; }

    public string Title { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EventDateTime { get; set; }

    [StringLength(255)]
    public string? LocationName { get; set; }

    [StringLength(255)]
    public string? ImageFileName { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [Precision(10)]
    public decimal? TicketPrice { get; set; }

    [Column(TypeName = "int(11)")]
    public int OrganizerID { get; set; }

    [Column(TypeName = "enum('rock','pop','electronic','hiphop','jazz','latin','metal','house','techno','drumandbass','other')")]
    public string MusicStyle { get; set; } = null!;

    [Column(TypeName = "int(11)")]
    public int? MaxAttendees { get; set; }

    public bool? IsPublic { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; }


    [ForeignKey("OrganizerID")]
    [InverseProperty("events")]
    public virtual user Organizer { get; set; } = null!;

    [InverseProperty("Event")]
    public virtual ICollection<attendance> attendances { get; set; } = new List<attendance>();

    [InverseProperty("Event")]
    public virtual ICollection<eventfavorite> eventfavorites { get; set; } = new List<eventfavorite>();

    [InverseProperty("Event")]
    public virtual ICollection<review> reviews { get; set; } = new List<review>();
}
