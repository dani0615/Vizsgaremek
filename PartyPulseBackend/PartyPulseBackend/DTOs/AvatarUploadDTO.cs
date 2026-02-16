using Microsoft.AspNetCore.Http;

namespace PartyPulseBackend.DTOs
{
    public class AvatarUploadDTO
    {
        public IFormFile File { get; set; }
    }
}
