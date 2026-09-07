using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.Commands.RefreshToken
{
    public class RefreshTokenCommand : IRequest<ApiResponse<LoginResponse>>
    {
        public string RefreshToken { get; set; } = string.Empty;
        public RefreshTokenCommand(string refreshToken)
        {
            RefreshToken = refreshToken;
        }
    }
}
