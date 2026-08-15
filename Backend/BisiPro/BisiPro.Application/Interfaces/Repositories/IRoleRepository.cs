using BisiPro.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IRoleRepository
    {
        Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken);

        Task<Role?> GetByIdAsync(Guid roleId, CancellationToken cancellationToken); 
    }
}
