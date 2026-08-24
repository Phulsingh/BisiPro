using BisiPro.Application.Features.Authentications.ForgotPassword.Commands;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using MediatR;
using System.Security.Cryptography;
using System.Text;

public class ForgotPasswordCommandHandler
    : IRequestHandler<
        ForgotPasswordCommand,
        ApiResponse<string>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenRepository _tokenRepository;
    private readonly IEmailService _emailService;

    public ForgotPasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordResetTokenRepository tokenRepository,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _tokenRepository = tokenRepository;
        _emailService = emailService;
    }

    public async Task<ApiResponse<string>> Handle(
        ForgotPasswordCommand command,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(
            command.Request.Email,
            cancellationToken);

        // IMPORTANT:
        // Don't reveal whether the email exists.
        if (user == null)
        {
            return new ApiResponse<string>
            {
                IsSuccess = true,
                Data = "If the email exists, a password reset link has been sent."
            };
        }

        var tokenBytes = RandomNumberGenerator.GetBytes(64);

        var token = Convert.ToBase64String(tokenBytes);

        var tokenHash = Convert.ToBase64String(
            SHA256.HashData(
                Encoding.UTF8.GetBytes(token)));

        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };

        await _tokenRepository.AddAsync(
            resetToken,
            cancellationToken);

        await _tokenRepository.SaveChangesAsync(
            cancellationToken);

        var resetLink =
          $"https://localhost:5173/reset-password?token={Uri.EscapeDataString(token)}";

        // Send token/link through email
        await _emailService.SendPasswordResetEmailAsync(
        user.Email,
        resetLink,
        cancellationToken);

        return new ApiResponse<string>
        {
            IsSuccess = true,
            Data = "If the email exists, a password reset link has been sent."
        };
    }
}