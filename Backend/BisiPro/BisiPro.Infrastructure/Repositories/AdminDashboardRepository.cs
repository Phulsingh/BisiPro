using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.DTO_s.AdminDashboard;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    internal class AdminDashboardRepository : IAdminDashboardRepository 
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalGroupsAsync( CancellationToken cancellationToken)
        {
            return await _context.Groups
                        .AsNoTracking()
                        .CountAsync(cancellationToken);
        }

        public async Task<int> GetTotalActiveGroupsAsync(CancellationToken cancellationToken)
        {
            return await _context.Groups
                         .AsNoTracking()
                         .Where(x => x.IsActive)
                         .CountAsync(cancellationToken);
        }
        public async Task<int> GetTotalMembersAsync(CancellationToken cancellationToken)
        {
            return await _context.Users
                        .AsNoTracking()
                        .Select(x => x.Id)
                        .Distinct()
                        .CountAsync(cancellationToken);
        }

        public async Task<int> GetTotalActiveMembersAsync(CancellationToken cancellationToken)
        {
            return await _context.Users
                         .AsNoTracking()
                         .Where(x => x.IsActive)
                         .Select(x => x.Id)
                         .Distinct()
                         .CountAsync(cancellationToken);
        }

        public async Task<List<RecentGroupResponse>> GetRecentGroupsAsync(int count, CancellationToken cancellationToken)
        {
            return await _context.Groups
                    .AsNoTracking()
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(count)
                    .Select(x => new RecentGroupResponse
                    {
                        Id = x.Id,
                        GroupName = x.GroupName,
                        CreatedAt = x.CreatedAt
                    })
                    .ToListAsync(cancellationToken);
        }

        public async Task<List<RecentMemberResponse>> GetRecentMembersAsync(int count, CancellationToken cancellationToken)
        {
            return await _context.GroupMembers
                         .AsNoTracking()
                         .Include(x => x.User)
                         .Include(x => x.Group)
                         .Where(x => x.IsActive)
                         .OrderByDescending(x => x.JoinedDate)
                         .Take(count)
                         .Select(x => new RecentMemberResponse
                         {
                             Id = x.User.Id,
                             FullName = x.User.FirstName + " " + x.User.LastName,
                             GroupId = x.Group.Id,
                             GroupName = x.Group.GroupName,
                             JoinedDate = x.JoinedDate

                         }).ToListAsync(cancellationToken);

        }

        public async Task<List<RecentActivityResponse>> GetRecentActivitiesAsync(
          int count,
          CancellationToken cancellationToken)
          {
            return await _context.ActivityLogs
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .Take(count)
                .Select(x => new RecentActivityResponse
                {
                    Id = x.Id,
                    ActivityType = x.ActivityType,
                    Message = x.Message,
                    UserId = x.UserId,
                    GroupId = x.GroupId,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }
    }
}
