using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces
{
    public interface IPasswordService
    {
        string HashPassword(User user,  string password);
        bool  VerifyPassword(User user, string hashedPassword, string providedPassword);
    }
}
