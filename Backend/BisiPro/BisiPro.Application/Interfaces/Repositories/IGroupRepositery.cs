using BisiPro.Application.Features.Groups;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using BisiPro.Domain.Entities;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IGroupRepository
    {
        Task<bool> ExistsByNameAsync(
            string groupName,
            CancellationToken cancellationToken);

        Task AddAsync(
            Group group,
            CancellationToken cancellationToken);

        Task<Group?> GetDetailsByIdAsync(
            Guid id,
            CancellationToken cancellationToken);

        Task<PagedResponse<GroupResponse>> GetByAgentIdAsync(
        Guid agentId,
        GroupFilterRequest filter,
        CancellationToken cancellationToken);

        Task<PagedResponse<GroupResponse>> GetAllAsync(
        GroupFilterRequest filter,
        CancellationToken cancellationToken);

        Task UpdateAsync(
            Group group,
            CancellationToken cancellationToken);

        Task DeleteAsync(
            Group group,
            CancellationToken cancellationToken);

        Task<List<GroupDropdownResponse>> GetDropdownByAgentIdAsync(
        Guid agentId,
        CancellationToken cancellationToken);

        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}
