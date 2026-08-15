using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using BisiPro.Domain.Entities;

namespace BisiPro.Infrastructure.Repositories
{
    public  class GroupMemberRepository : IGroupMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupMemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GroupMember?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.GroupMembers
                         .Include(x => x.User)
                         .Include(x => x.Group)
                         .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
                      
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
                   .Include( x => x.User)
                   .Where(x => x.GroupId == groupId && x.IsActive)
                   .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(GroupMember groupMember, CancellationToken cancellation)
        {   
            await _context.GroupMembers.AddAsync(groupMember, cancellation);
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
