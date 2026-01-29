namespace PartyPulseBackend.DTOs
{
    public class EventDTO
    {
        public string Title { get; set; }
        public string?  Description { get; set; }
        public DateTime EventDateTime { get; set; }
        public string? Address { get; set; }
        public string? LocationName { get; set; }
        public string? ImageUrl { get; set; }
    }
}
