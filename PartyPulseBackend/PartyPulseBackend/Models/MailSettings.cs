namespace PartyPulseBackend.Models
{
    public class MailSettings
    {
        public string SmtpServer { get; set; }
        public string SmtpUser { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string SenderPassword { get; set; }
        public int Port { get; set; }
    }
}
