using BisiPro.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IActivityLogRepository
    {
        Task AddAsync(
            ActivityLog activityLog,
            CancellationToken cancellationToken);

        Task SaveChangesAsync(
            CancellationToken cancellationToken);
    }
}
