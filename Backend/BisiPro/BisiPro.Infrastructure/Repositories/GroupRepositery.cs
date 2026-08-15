using BisiPro.Application.Features.Groups;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByNameAsync(string GroupName, CancellationToken cancellationToken
            )
        {
            return await _context.Groups.AnyAsync(x => x.GroupName == GroupName, cancellationToken);
        }

        public async Task AddAsync(Group group, CancellationToken cancellationToken)
        {
            await _context.Groups.AddAsync(group, cancellationToken);
        }

        public async Task<Group?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Groups
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<PagedResponse<Group>> GetByAgentIdAsync(
            Guid agentId,
            GroupFilterRequest filter,
            CancellationToken cancellationToken)
        {
            var query = _context.Groups.AsNoTracking()
                          .Where(x => x.AgentId == agentId);
            // Search by Group Name
            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query
                        .Where(x => x.GroupName
                        .Contains(filter.Search));
            }

            // Filter by Bisi Type
            if (filter.BisiType.HasValue)
            {
                query = query
                       .Where(x => x.BisiType == filter.BisiType);
            }

            // Filter by Active / Inactive
            if (filter.IsActive.HasValue)
            {
                query = query
                       .Where(x=> x.IsActive == filter.IsActive.Value);
            }


            // Filter by Start Date - From
            if (filter.StartDateFrom.HasValue)
            {
                query = query.Where(x=> x.StartDate >=
                            filter.StartDateFrom.Value);
            }

            // Filter by Start Date - To
            if (filter.StartDateTo.HasValue)
            {
                query = query.Where(x => x.StartDate <=      filter.StartDateTo.Value);
            }

            // Sorting
            query = filter.SortBy?.ToLower() switch
            {
                "groupname" => filter.SortOrder?.ToLower() == "desc" ?
                   query.OrderByDescending(x => x.GroupName) :
                   query.OrderBy(x => x.GroupName),

               "startdate" => filter.SortOrder?.ToLower() == "desc"
               ? query.OrderByDescending(x => x.StartDate)
              : query.OrderBy(x => x.StartDate),

                "totalmembers" => filter.SortOrder?.ToLower() == "desc"
              ? query.OrderByDescending(x => x.TotalMembers)
              : query.OrderBy(x => x.TotalMembers),

                "createddate" => filter.SortOrder?.ToLower() == "desc"
             ? query.OrderByDescending(x => x.CreatedAt)
             : query.OrderBy(x => x.CreatedAt),

                _ => query.OrderByDescending(x => x.CreatedAt)
            };


            // Get total count BEFORE pagination
            var totalCount = await query.CountAsync(
                cancellationToken);

            // Validate page size
            var pageNumber = filter.PageNumber < 1 ? 1 : filter.PageNumber;

            // Validate page size
            var pazeSize = filter.PageSize < 1 ? 10 : filter.PageSize;

            // Pagination
            var group = await query
                     .Skip((pageNumber - 1) * pazeSize)
                     .Take(pazeSize)
                     .ToListAsync(cancellationToken);

            // Calculate total pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pazeSize);


            return new PagedResponse<Group>
            {
                 Data = group,
                 PageNumber = pageNumber,
                 PageSize = pazeSize,
                 TotalCount = totalCount,
                 TotalPages = totalPages
            };

        }

        public Task UpdateAsync(
           Group group,
           CancellationToken cancellationToken)
        {
            _context.Groups.Update(group);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(
          Group group,
          CancellationToken cancellationToken)
        {
            _context.Groups.Remove(group);
            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync(
            CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }


    }
}
