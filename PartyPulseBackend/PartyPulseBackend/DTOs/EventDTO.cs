namespace PartyPulseBackend.DTOs
{
    public class EventDTO
    {
        public int EventID { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime EventDateTime { get; set; }
        public string? Address { get; set; }
        public string? LocationName { get; set; }
        public string? ImageUrl { get; set; }
        public string? MusicStyle { get; set; }
        public decimal? TicketPrice { get; set; }
        public int? MaxAttendees { get; set; }
        public bool IsPublic { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Batch status fields (populated by AllEventsWithStatus endpoint)
        public int AttendeeCount { get; set; }
        public bool? IsAttending { get; set; }
        public bool? IsFavorite { get; set; }
        public bool HasEnded { get; set; }
        public bool? IsReviewed { get; set; }
        public bool IsFeatured { get; set; }
    }
}

