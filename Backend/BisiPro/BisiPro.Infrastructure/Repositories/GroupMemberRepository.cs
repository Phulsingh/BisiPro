using BisiPro.Application.Filters;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public  class GroupMemberRepository : IGroupMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupMemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(GroupMember groupMember, CancellationToken cancellation)
        {   
            await _context.GroupMembers.AddAsync(groupMember, cancellation);
        }

        public async Task<PagedResponse<GroupMember>> GetByAgentIdAsync(
            Guid agentId,
            GroupMemberFilter filter,
            CancellationToken cancellationToken
            )
        {
            var query = _context.GroupMembers
                .AsNoTracking()
                .Include(x => x.User)
                .Include(x => x.Group)
                .Where(x => x.Group.AgentId == agentId);

            // Name filter
            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                query = query.Where(x =>
                    x.User.FirstName.Contains(filter.Name) ||
                    x.User.LastName.Contains(filter.Name));
            }

            // Group filter
            if (filter.GroupId.HasValue)
            {
                query = query.Where(x =>
                    x.GroupId == filter.GroupId.Value);
            }

            // IsActive filter
            if (filter.IsActive.HasValue)
            {
                query = query.Where(x =>
                    x.IsActive == filter.IsActive.Value);
            }

            // Total records before pagination
            var totalCount = await query.CountAsync(
             cancellationToken);

            var members = await query
                  .OrderBy(x => x.User.FirstName)
                  .Skip((filter.PageNumber - 1) * filter.PageSize)
                  .Take(filter.PageSize)
                  .ToListAsync(cancellationToken);

            return new PagedResponse<GroupMember>
            {
                Data = members,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount
            };
        }


        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
