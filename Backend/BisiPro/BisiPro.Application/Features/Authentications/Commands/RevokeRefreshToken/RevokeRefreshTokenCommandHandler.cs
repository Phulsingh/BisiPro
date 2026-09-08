using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Authentications.Commands.RevokeRefreshToken
{
    public class RevokeRefreshTokenCommandHandler : IRequestHandler<
            RevokeRefreshTokenCommand,
            ApiResponse<bool>>
    {
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public RevokeRefreshTokenCommandHandler(
            IRefreshTokenService refreshTokenService,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _refreshTokenService = refreshTokenService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<ApiResponse<bool>> Handle(
            RevokeRefreshTokenCommand command,
            CancellationToken cancellationToken)
        {
            // Signing out always succeeds from the caller's point of view: an
            // unknown or already revoked token simply has nothing left to do.
            if (string.IsNullOrWhiteSpace(command.RefreshToken))
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = true,
                    Data = true
                };
            }

            var tokenHash =
                _refreshTokenService.HashToken(
                    command.RefreshToken);

            var refreshToken =
                await _refreshTokenRepository.GetByTokenHashAsync(
                    tokenHash,
                    cancellationToken);

            if (refreshToken == null || refreshToken.RevokedAt.HasValue)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = true,
                    Data = true
                };
            }

            refreshToken.RevokedAt = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(
                refreshToken,
                cancellationToken);

            await _refreshTokenRepository.SaveChangesAsync(
                cancellationToken);

            return new ApiResponse<bool>
            {
                IsSuccess = true,
                Data = true
            };
        }
    }
}
