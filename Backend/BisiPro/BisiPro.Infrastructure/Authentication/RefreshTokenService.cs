using BisiPro.Application.Interfaces.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace BisiPro.Infrastructure.Authentication
{
    public class RefreshTokenService : IRefreshTokenService
    {
        public string GenerateToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);

            return Convert.ToBase64String(randomBytes);
        }

        public string HashToken(string token)
        {
            var bytes = SHA256.HashData(
                Encoding.UTF8.GetBytes(token));

            return Convert.ToBase64String(bytes);
        }
    }
}
