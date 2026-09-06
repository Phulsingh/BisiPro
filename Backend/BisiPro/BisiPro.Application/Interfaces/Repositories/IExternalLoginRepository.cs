using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IExternalLoginRepository
    {
        Task<ExternalLogin?> GetByProviderAsync(
          string provider,
          string providerKey,
          CancellationToken cancellationToken);

        Task AddAsync(
            ExternalLogin externalLogin,
            CancellationToken cancellationToken);

        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }

}
