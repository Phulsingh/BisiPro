using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;


namespace BisiPro.Application.Features.Authentications.Commands.RefreshToken
{
    public class RefreshTokenCommandHandler : IRequestHandler<
            RefreshTokenCommand,
            ApiResponse<LoginResponse>>
    {
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public RefreshTokenCommandHandler(
           IRefreshTokenService refreshTokenService,
           IRefreshTokenRepository refreshTokenRepository,
           IJwtTokenService jwtTokenService)
        {
            _refreshTokenService = refreshTokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ApiResponse<LoginResponse>> Handle(
          RefreshTokenCommand command,
          CancellationToken cancellationToken)
        {
            // Step 1: Validate refresh token input
            if (string.IsNullOrWhiteSpace(command.RefreshToken))
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Refresh token is required."
                };
            }

            // Step 2: Hash the refresh token
            var tokenHash =
                _refreshTokenService.HashToken(
                    command.RefreshToken);

            // Step 3: Find refresh token in database
            var refreshToken =
                await _refreshTokenRepository.GetByTokenHashAsync(
                    tokenHash,
                    cancellationToken);

            if (refreshToken == null)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Invalid refresh token."
                };
            }


            // Step 4: Check if refresh token is expired
            if (refreshToken.ExpiresAt <= DateTime.UtcNow)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Refresh token has expired."
                };
            }


            // Step 5: Check if refresh token was revoked
            if (refreshToken.RevokedAt.HasValue)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Refresh token has been revoked."
                };
            }

            // Step 6: Check if user is active
            var user = refreshToken.User;

            if (!user.IsActive)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Your account is inactive."
                };
            }

            // Step 7: Generate new access token
            var newAccessToken =
                _jwtTokenService.GenerateToken(user);

            // Step 8: Generate new refresh token
            var newRefreshToken =
                _refreshTokenService.GenerateToken();

            // Step 9: Hash new refresh token
            var newRefreshTokenHash =
                _refreshTokenService.HashToken(
                    newRefreshToken);

            // Step 10: Revoke old refresh token
            refreshToken.RevokedAt = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(
               refreshToken,
               cancellationToken);

            // Step 11: Create new refresh token
            var newRefreshTokenEntity =
                new Domain.Entities.RefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    TokenHash = newRefreshTokenHash,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    CreatedAt = DateTime.UtcNow
                };
            await _refreshTokenRepository.AddAsync(
              newRefreshTokenEntity,
              cancellationToken);

            // Step 12: Save changes
            await _refreshTokenRepository.SaveChangesAsync(
                cancellationToken);

            // Step 13: Return new tokens
            return new ApiResponse<LoginResponse>
            {
                IsSuccess = true,
                Data = new LoginResponse
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Token = newAccessToken,
                    RefreshToken = newRefreshToken,
                    Role = user.Role.Name
                }
            };

        }
    }
}
