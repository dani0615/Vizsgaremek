namespace PartyPulseBackend.DTOs
{
    public class CreateEventDTO
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime EventDateTime { get; set; }
        public string? LocationName { get; set; }
        public string? Address { get; set; }
        public decimal? TicketPrice { get; set; }
        public string MusicStyle { get; set; } = null!; 
        public int? MaxAttendees { get; set; }
        public bool IsPublic { get; set; } = true;

        public IFormFile? Image { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public bool IsFeatured { get; set; } = false;
    }
}