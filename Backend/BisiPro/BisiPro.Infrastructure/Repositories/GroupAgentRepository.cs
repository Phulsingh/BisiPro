using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public class GroupAgentRepository : IGroupAgentRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupAgentRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GroupAgent>> GetByGroupIdAsync(
            Guid groupId,
            CancellationToken cancellationToken)
        {
            return await _context.GroupAgents
                .Where(x => x.GroupId == groupId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddRangeAsync(
            IEnumerable<GroupAgent> groupAgents,
            CancellationToken cancellationToken)
        {
            await _context.GroupAgents.AddRangeAsync(
                groupAgents,
                cancellationToken);
        }

        public void RemoveRange(
            IEnumerable<GroupAgent> groupAgents)
        {
            _context.GroupAgents.RemoveRange(groupAgents);
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}