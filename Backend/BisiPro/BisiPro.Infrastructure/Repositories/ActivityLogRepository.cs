using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;

namespace BisiPro.Infrastructure.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(
            ActivityLog activityLog,
            CancellationToken cancellationToken)
        {
            await _context.ActivityLogs.AddAsync(
                activityLog,
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