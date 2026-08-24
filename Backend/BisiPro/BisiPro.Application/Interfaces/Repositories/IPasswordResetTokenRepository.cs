using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(
            PasswordResetToken token,
            CancellationToken cancellationToken);
        Task<PasswordResetToken?> GetByTokenHashAsync(
            string tokenHash,
            CancellationToken cancellationToken);
        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}
