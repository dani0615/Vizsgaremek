using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Data;
using PartyPulseBackend.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PartyPulseBackend.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly PartyPulseContext _context;
        private readonly byte[] _aesKey;

        public ChatHub(PartyPulseContext context, IConfiguration configuration)
        {
            _context = context;
            var keyString = configuration["AesSettings:EncryptionKey"] ?? "PartyPulseAES256Key!2026SecretXX";
            _aesKey = Encoding.UTF8.GetBytes(keyString);
        }

        /// <summary>
        /// Amikor a felhasználó csatlakozik, automatikusan feliratkoztatjuk
        /// az összes olyan ChatRoom-ra, ahol ő az egyik fél a matchben.
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            var userIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                Context.Abort();
                return;
            }

            int userId = int.Parse(userIdClaim);

            // Azok a matchek, ahol ez a user részt vesz ÉS mindkét fél likeolta egymást
            var matchedRooms = await _context.Matches
                .Where(m =>
                    (m.User1ID == userId || m.User2ID == userId) &&
                    m.User1Liked == true && m.User2Liked == true &&
                    m.ChatRoomID != null)
                .Select(m => m.ChatRoomID!.Value.ToString())
                .ToListAsync();

            foreach (var room in matchedRooms)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, room);
            }

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Üzenet küldése egy chat szobába.
        /// Az üzenetet AES-sel titkosítva tároljuk, dekódoltan továbbítjuk.
        /// </summary>
        public async Task SendMessage(Guid chatRoomId, string message)
        {
            var userIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return;
            int senderId = int.Parse(userIdClaim);

            // Ellenőrzés: a user valóban tagja-e ennek a chatRoom-nak?
            var match = await _context.Matches.FirstOrDefaultAsync(m =>
                m.ChatRoomID == chatRoomId &&
                (m.User1ID == senderId || m.User2ID == senderId) &&
                m.User1Liked == true && m.User2Liked == true);

            if (match == null)
            {
                await Clients.Caller.SendAsync("Error", "Nincs hozzáférésed ehhez a szobához.");
                return;
            }

            if (string.IsNullOrWhiteSpace(message))
            {
                await Clients.Caller.SendAsync("Error", "Az üzenet nem lehet üres.");
                return;
            }

            // AES titkosítás
            var (encryptedMessage, iv) = EncryptMessage(message, _aesKey);

            // Mentés adatbázisba
            var chatMessage = new Chatmessage
            {
                MatchID = match.MatchID,
                SenderID = senderId,
                EncryptedMessage = encryptedMessage,
                EncryptionIV = iv,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Chatmessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            // Sender adatai
            var sender = await _context.Users
                .Where(u => u.UserID == senderId)
                .Select(u => new { u.UserID, u.Username, Name = u.DisplayName ?? u.Username })
                .FirstOrDefaultAsync();

            // Üzenet szétküldése a csoportnak (dekódoltan)
            await Clients.Group(chatRoomId.ToString()).SendAsync("ReceiveMessage", new
            {
                messageId = chatMessage.MessageID,
                chatRoomId,
                sender,
                message, // dekódolt szöveg
                sentAt = chatMessage.SentAt
            });
        }

        /// <summary>
        /// Amikor a felhasználó csatlakozik egy adott chatroom-hoz
        /// (pl. chat oldal megnyitásakor hívható manuálisan is).
        /// A feliratkozás már automatikus OnConnectedAsync-ban, 
        /// de ez explicit is meghívható.
        /// </summary>
        public async Task JoinRoom(Guid chatRoomId)
        {
            var userIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return;
            int userId = int.Parse(userIdClaim);

            var match = await _context.Matches.FirstOrDefaultAsync(m =>
                m.ChatRoomID == chatRoomId &&
                (m.User1ID == userId || m.User2ID == userId) &&
                m.User1Liked == true && m.User2Liked == true);

            if (match != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
            }
        }

        // --- Helper: AES-256 CBC titkosítás ---
        private static (string encryptedBase64, string ivBase64) EncryptMessage(string plainText, byte[] aesKey)
        {
            using var aes = Aes.Create();
            aes.Key = aesKey;
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using var ms = new MemoryStream();
            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (var sw = new StreamWriter(cs))
            {
                sw.Write(plainText);
            }

            return (
                Convert.ToBase64String(ms.ToArray()),
                Convert.ToBase64String(aes.IV)
            );
        }

        public static string DecryptMessage(string encryptedBase64, string ivBase64, byte[] aesKey)
        {
            using var aes = Aes.Create();
            aes.Key = aesKey;
            aes.IV = Convert.FromBase64String(ivBase64);

            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            using var ms = new MemoryStream(Convert.FromBase64String(encryptedBase64));
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);
            return sr.ReadToEnd();
        }
    }
}