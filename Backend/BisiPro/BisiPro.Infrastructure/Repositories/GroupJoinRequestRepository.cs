using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Domain.Entities;
using BisiPro.Domain.Enums;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public class GroupJoinRequestRepository
        : IGroupJoinRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupJoinRequestRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPendingRequestAsync(
            Guid groupId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await _context.GroupJoinRequests
                .AnyAsync(
                    x =>
                        x.GroupId == groupId &&
                        x.UserId == userId &&
                        x.Status == JoinRequestStatus.Pending,
                        cancellationToken);
        }

        public async Task AddAsync(
            GroupJoinRequest request,
            CancellationToken cancellationToken)
        {
            await _context.GroupJoinRequests.AddAsync(
                request,
                cancellationToken);
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(
                cancellationToken);
        }
    }
}