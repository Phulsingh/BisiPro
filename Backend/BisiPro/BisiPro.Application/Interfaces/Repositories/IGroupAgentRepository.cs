using BisiPro.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IGroupAgentRepository
    {
        Task<List<GroupAgent>> GetByGroupIdAsync(
            Guid groupId,
            CancellationToken cancellationToken);
        Task AddRangeAsync(
            IEnumerable<GroupAgent> groupAgents,
            CancellationToken cancellationToken);
        void RemoveRange(
            IEnumerable<GroupAgent> groupAgents);
        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}
