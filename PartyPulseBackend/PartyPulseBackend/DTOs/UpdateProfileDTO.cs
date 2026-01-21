namespace PartyPulseBackend.DTOs
{
    public class UpdateProfileDTO
    {
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
    }
}
