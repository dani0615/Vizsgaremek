namespace PartyPulseBackend.DTOs
{
    public class UserRegistrationDTO
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? LookingFor { get; set; }
        public string? DisplayName { get; set; }
    }
}
