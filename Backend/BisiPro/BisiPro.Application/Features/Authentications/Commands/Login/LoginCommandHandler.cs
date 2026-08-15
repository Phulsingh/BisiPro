using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;


namespace BisiPro.Application.Features.Authentications.Commands.Login
{
   public class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse<LoginResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtTokenService;

        public LoginCommandHandler(
            IUserRepository userRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
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

            // Step 4 : Return Response
            return new ApiResponse<LoginResponse>
            {
                IsSuccess = true,
                Data = new LoginResponse
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Token = token
                }
            };
        }
    }

}
