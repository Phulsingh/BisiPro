using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<bool> ExistsByEmailAsync(
            string email, 
            CancellationToken cancellationToken);

        Task<User?> AddAsync(
            User user, 
            CancellationToken cancellationToken);

        Task<User?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken);

        Task<User?> GetByEmailAsync(
            string email, 
            CancellationToken cancellationToken);

        Task UpdateAsync(
            User user,
            CancellationToken cancellationToken);

        Task DeleteAsync(
            User user,
            CancellationToken cancellationToken);

        Task SaveChangesAsync(
             CancellationToken cancellationToken);

    }
}
