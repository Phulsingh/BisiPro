using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BisiPro.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Role?> GetByNameAsync( string roleName , CancellationToken cancellationToken)
        {
            return await _context.Roles
                        .FirstOrDefaultAsync(x => x.Name == roleName, cancellationToken);
        }

        public async Task<Role?> GetByIdAsync(Guid roleId, CancellationToken cancellationToken)
        {
            return await _context.Roles
                        .FirstOrDefaultAsync(x => x.Id == roleId, cancellationToken);
        }
    }
}
