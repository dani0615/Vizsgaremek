namespace PartyPulseBackend.DTOs
{
    public class BadgeDTO
    {
        public int BadgeID { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public string Criteria { get; set; } = null!;
        public bool IsEarned { get; set; }
        public DateTime? AwardedAt { get; set; }
        public bool IsPinned { get; set; }
    }
}