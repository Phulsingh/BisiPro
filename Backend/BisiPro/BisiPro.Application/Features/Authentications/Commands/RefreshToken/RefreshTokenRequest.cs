using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.Commands.RefreshToken
{
    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
