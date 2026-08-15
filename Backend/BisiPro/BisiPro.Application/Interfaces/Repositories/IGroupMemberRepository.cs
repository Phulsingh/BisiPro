using BisiPro.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IGroupMemberRepository
    {
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

        Task<List<GroupMember>> GetByGroupIdAsync(
            Guid groupId,
            CancellationToken cancellationToken);

        Task AddAsync(
           GroupMember groupMember,
           CancellationToken cancellationToken);

        Task SaveChangesAsync(
           CancellationToken cancellationToken);
    }
}
