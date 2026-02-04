namespace PartyPulseBackend.DTOs
{
    public class EventDTO
    {
        public int EventID { get; set; }
        public string Title { get; set; }
        public string?  Description { get; set; }
        public DateTime EventDateTime { get; set; }
        public string? Address { get; set; }
        public string? LocationName { get; set; }
        public string? ImageUrl { get; set; }
        public string? MusicStyle { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
