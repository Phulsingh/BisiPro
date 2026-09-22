using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IGroupJoinRequestRepository
    {
        Task<bool> HasPendingRequestAsync(
            Guid groupId,
            Guid userId,
            CancellationToken cancellationToken);

        Task AddAsync(
            GroupJoinRequest request,
            CancellationToken cancellationToken);

        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}