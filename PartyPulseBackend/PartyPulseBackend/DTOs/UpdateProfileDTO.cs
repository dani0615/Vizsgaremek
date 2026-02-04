namespace PartyPulseBackend.DTOs
{
    public class UpdateProfileDTO
    {
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? LookingFor { get; set; }
    }
}
