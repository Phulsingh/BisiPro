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
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                query = query.Where(x =>
                    x.User.FirstName.Contains(filter.Search) ||
                    x.User.LastName.Contains(filter.Search));
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

        public async Task<GroupMember?> GetByGroupAndUserAsync(
     Guid groupId,
     Guid userId,
     CancellationToken cancellationToken)
        {
            return await _context.GroupMembers
                .FirstOrDefaultAsync(
                    x => x.GroupId == groupId &&
                         x.UserId == userId,
                    cancellationToken);
        }

        public async Task<int> GetActiveMemberCountAsync(
            Guid id, CancellationToken cancellationToken)
        {
            return await _context.GroupMembers
                    .CountAsync(x => x.GroupId == id && x.IsActive, cancellationToken);
        }

        public async Task<List<GroupMember>> GetByGroupIdAsync(
         Guid groupId,
         CancellationToken cancellationToken)
        {
            return await _context.GroupMembers
                   .AsNoTracking()
                   .Include(x => x.User)
                   .Where(x => x.GroupId == groupId && x.IsActive)
                   .ToListAsync(cancellationToken);
        }



        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
