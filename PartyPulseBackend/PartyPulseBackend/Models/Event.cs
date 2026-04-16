using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace PartyPulseBackend.Models;

[Index("OrganizerID", Name = "OrganizerID")]
[Index("EventDateTime", Name = "idx_datetime")]
[Index("MusicStyle", Name = "idx_music")]
public partial class Event
{
    [Key]
    [Column(TypeName = "int(11)")]
    public int EventID { get; set; }

    public string Title { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EventDateTime { get; set; }

    public Point Location { get; set; } = null!;

    [StringLength(255)]
    public string? LocationName { get; set; }

    [StringLength(255)]
    public string? ImageFileName { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [Precision(10, 2)]
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

    [NotMapped]
    public double Latitude { get; set; }
    [NotMapped]
    public double Longitude { get; set; }

    public bool IsFeatured { get; set; } = false;

    [ForeignKey("OrganizerID")]
    [InverseProperty("Events")]
    public virtual User Organizer { get; set; } = null!;

    [InverseProperty("Event")]
    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    [InverseProperty("Event")]
    public virtual ICollection<Eventfavorite> Eventfavorites { get; set; } = new List<Eventfavorite>();

    [InverseProperty("Event")]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
