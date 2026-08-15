using BisiPro.Application.Interfaces.Repositories;
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
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);   
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
