using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IRefreshTokenService
    {
        string GenerateToken();
        string HashToken(string token);
    }
}
