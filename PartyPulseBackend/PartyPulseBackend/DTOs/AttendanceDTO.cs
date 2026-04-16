namespace PartyPulseBackend.DTOs
{
    public class AttendedEventDTO
    {
        public int EventID { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime EventDateTime { get; set; }
        public string? LocationName { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }
        public string? MusicStyle { get; set; }
        public decimal? TicketPrice { get; set; }
        public string? Status { get; set; }
        public DateTime RegisteredAt { get; set; }
    }

    public class AttendanceStatusDTO
    {
        public bool IsAttending { get; set; }
        public string? Status { get; set; }
    }
}