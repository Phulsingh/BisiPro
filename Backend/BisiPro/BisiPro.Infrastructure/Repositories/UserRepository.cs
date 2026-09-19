using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Users;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> AddAsync(User user, CancellationToken cancellationToken)
        {
            await _context.Users.AddAsync(user, cancellationToken);
            return user;
        }

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken)
        {
            return await _context.Users.AnyAsync(x => x.Email == email, cancellationToken);
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken
            ) 
        {
            return await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

        }

        public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Users
                .AsNoTracking()
                .Include(x => x.GroupMemberships)
                 .ThenInclude(x => x.Group)
                 .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);
        }


        public async Task<PagedResponse<AgentDropdownResponse>>GetAgentsDropdownAsync(
          AgentFilterRequest filter,
          CancellationToken cancellationToken)
        {
            var query = _context.Users
                 .AsNoTracking()
                 .Where(x => x.Role.Name == "Agent" && x.IsActive);

            // Search
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.Trim();

                query = query.Where(x =>
                    (x.FirstName + " " + x.LastName).Contains(search) ||
                    x.Email.Contains(search) ||
                    x.PhoneNumber.Contains(search));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var data = await query
                .OrderBy(x => x.FirstName)
                .ThenBy(x => x.LastName)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new AgentDropdownResponse
                {
                    UserId = x.Id,
                    Name = x.FirstName + " " + x.LastName
                })
                .ToListAsync(cancellationToken);

               var totalPages = (int)Math.Ceiling(
                 totalCount / (double)filter.PageSize);

            return new PagedResponse<AgentDropdownResponse>
            {
                Data = data,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }

        public Task UpdateAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Update(user);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Remove(user);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

}
