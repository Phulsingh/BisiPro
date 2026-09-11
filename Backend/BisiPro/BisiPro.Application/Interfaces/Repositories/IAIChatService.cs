using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IAIChatService
    {
        Task<string> GenerateResponseAsync(
            string message,
            CancellationToken cancellationToken);
    }
}
