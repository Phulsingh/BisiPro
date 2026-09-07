using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;
using RefreshTokenEntity = BisiPro.Domain.Entities.RefreshToken;

namespace BisiPro.Application.Features.Authentications.Commands.Login
{
   public class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse<LoginResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;


        public LoginCommandHandler(
            IUserRepository userRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtTokenService,
            IRefreshTokenService refreshTokenService,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
            _refreshTokenService = refreshTokenService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<ApiResponse<LoginResponse>> Handle(
            LoginCommand command,
            CancellationToken cancellationToken)
        {
            // Step 1 : Find user by email
            var user = await _userRepository.GetByEmailAsync(
                command.Request.Email,
                cancellationToken);

            if (user == null)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Invalid email or password."
                };
            }

            // Step 2 : Verify Password
            var isPasswordValid = _passwordService.VerifyPassword(
                user,
                user.PasswordHash,
                command.Request.Password);

            if (!isPasswordValid)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Invalid email or password."
                };
            }

            // Step 3 : Generate JWT Token
            var token = _jwtTokenService.GenerateToken(user);

            // Step 4 : Generate Refresh Token
            var refreshToken = _refreshTokenService.GenerateToken();

            // Step 5 : Hash Refresh Token
            var refreshTokenHash =
                _refreshTokenService.HashToken(refreshToken);

            // Step 6 : Create RefreshToken entity
            var refreshTokenEntity = new RefreshTokenEntity
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TokenHash = refreshTokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };


            // Step 7 : Save Refresh Token
            await _refreshTokenRepository.AddAsync(
                refreshTokenEntity,
                cancellationToken);

            await _refreshTokenRepository.SaveChangesAsync(
                cancellationToken);

            // Step 8 : Return Response
            return new ApiResponse<LoginResponse>
            {
                IsSuccess = true,
                Data = new LoginResponse
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Token = token,
                    RefreshToken = refreshToken,
                    Role = user.Role.Name
                }
            };
        }
    }

}
