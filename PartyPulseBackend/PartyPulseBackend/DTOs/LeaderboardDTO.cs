namespace PartyPulseBackend.DTOs
{
    public class LeaderboardDTO
    {
        public int UserId { get; set; }
        public int Rank { get; set; }
        public string UserName { get; set; }
        public int PartyCount { get; set; }
        public int Score { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}
