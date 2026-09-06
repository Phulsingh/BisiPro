using BisiPro.Infrastructure.Persistence;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public class ExternalLoginRepository : IExternalLoginRepository
    {
        private readonly ApplicationDbContext _context;

        public ExternalLoginRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ExternalLogin?> GetByProviderAsync(
            string provider,
            string providerKey,
            CancellationToken cancellationToken)
        {
            return await _context.ExternalLogins
                  .Include(x => x.User)
                      .ThenInclude(u => u.Role)
                  .FirstOrDefaultAsync(
                  x => x.Provider == provider && 
                  x.ProviderKey == providerKey,
                cancellationToken);
               
        }
        public async Task AddAsync(
            ExternalLogin externalLogin,
            CancellationToken cancellationToken)
        {
            await _context.ExternalLogins.AddAsync(
                externalLogin,
                cancellationToken);
        }
        public async Task SaveChangesAsync(
           CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
