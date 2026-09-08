using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Authentications.Commands.RevokeRefreshToken
{
    /// <summary>
    /// Revokes a single refresh token, so a signed out session cannot be
    /// renewed even if the token was captured beforehand.
    /// </summary>
    public class RevokeRefreshTokenCommand : IRequest<ApiResponse<bool>>
    {
        public string RefreshToken { get; set; } = string.Empty;

        public RevokeRefreshTokenCommand(string refreshToken)
        {
            RefreshToken = refreshToken;
        }
    }
}
