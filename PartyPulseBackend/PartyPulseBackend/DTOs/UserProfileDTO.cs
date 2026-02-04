namespace PartyPulseBackend.DTOs
{
    public class UserProfileDTO
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int Points { get; set; }
        public string Role { get; set; } = null!;
        public string? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? LookingFor { get; set; }

    }
}
