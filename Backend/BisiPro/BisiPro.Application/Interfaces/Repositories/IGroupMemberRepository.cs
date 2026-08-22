using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using BisiPro.Application.Filters;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IGroupMemberRepository
    {

        Task<PagedResponse<GroupMember>> GetByAgentIdAsync(
        Guid agentId,
        GroupMemberFilter filter,
        CancellationToken cancellationToken);

        Task<GroupMember?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken);

        Task<GroupMember?> GetByGroupAndUserAsync(
          Guid groupId,
          Guid userId,
          CancellationToken cancellationToken);

        Task<int> GetActiveMemberCountAsync(
          Guid groupId,
          CancellationToken cancellationToken);

        Task AddAsync(
           GroupMember groupMember,
           CancellationToken cancellationToken);

        Task SaveChangesAsync(
           CancellationToken cancellationToken);
    }
}
