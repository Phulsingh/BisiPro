using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(
            string email,
            string resetLink,
            CancellationToken cancellationToken);
    }
}
