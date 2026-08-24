using BisiPro.Application.Features.Authentications.ResetPassword;
using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using MediatR;
using System.Security.Cryptography;
using System.Text;

namespace BisiPro.Application.Features.Authentications.Commands.ResetPassword
{
    public class ResetPasswordCommandHandler
        : IRequestHandler<
            ResetPasswordCommand,
            ApiResponse<string>>
    {
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;

        public ResetPasswordCommandHandler(
            IPasswordResetTokenRepository tokenRepository,
            IUserRepository userRepository,
            IPasswordService passwordService)
        {
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
            _passwordService = passwordService;
        }

        public async Task<ApiResponse<string>> Handle(
            ResetPasswordCommand command,
            CancellationToken cancellationToken)
        {
            // 1. Validate token
            if (string.IsNullOrWhiteSpace(command.Request.Token))
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Error = "Invalid reset token."
                };
            }

            // 2. Hash the received token
            var tokenHash = Convert.ToBase64String(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(
                        command.Request.Token)));

            // 3. Find token in database
            var resetToken =
                await _tokenRepository.GetByTokenHashAsync(
                    tokenHash,
                    cancellationToken);

            if (resetToken == null)
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Error = "Invalid or expired reset token."
                };
            }

            // 4. Check if token was already used
            if (resetToken.UsedAt.HasValue)
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Error = "This reset token has already been used."
                };
            }

            // 5. Check expiry
            if (resetToken.ExpiresAt <= DateTime.UtcNow)
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Error = "Reset token has expired."
                };
            }

            // 6. Get User
            var user = await _userRepository.GetByIdAsync(
                resetToken.UserId,
                cancellationToken);

            if (user == null)
            {
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Error = "User not found."
                };
            }

            // 7. Hash new password
            user.PasswordHash =
                _passwordService.HashPassword(
                    user,
                    command.Request.NewPassword);

            // 8. Mark token as used
            resetToken.UsedAt = DateTime.UtcNow;

            // 9. Save
            await _userRepository.SaveChangesAsync(
                cancellationToken);

            await _tokenRepository.SaveChangesAsync(
                cancellationToken);

            // 10. Response
            return new ApiResponse<string>
            {
                IsSuccess = true,
                Data = "Password reset successfully."
            };
        }
    }
}