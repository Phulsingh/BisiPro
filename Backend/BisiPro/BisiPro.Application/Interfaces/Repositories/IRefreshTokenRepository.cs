using BisiPro.Domain.Entities;
namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenHashAsync(
           string tokenHash,
           CancellationToken cancellationToken);

        Task AddAsync(
            RefreshToken refreshToken,
            CancellationToken cancellationToken);

        Task UpdateAsync(
            RefreshToken refreshToken,
            CancellationToken cancellationToken);

        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}
