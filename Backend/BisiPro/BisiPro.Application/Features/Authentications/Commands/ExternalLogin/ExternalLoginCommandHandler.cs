using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;
using BisiPro.Domain.Entities;

namespace BisiPro.Application.Features.Authentications.Commands.ExternalLogin
{
    public class ExternalLoginCommandHandler
        : IRequestHandler<
            ExternalLoginCommand,
            ApiResponse<LoginResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IExternalLoginRepository _externalLoginRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public ExternalLoginCommandHandler(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            IExternalLoginRepository externalLoginRepository,
            IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _externalLoginRepository = externalLoginRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ApiResponse<LoginResponse>> Handle(
            ExternalLoginCommand command,
            CancellationToken cancellationToken)
        {
            // ========================================================
            // 1. Check if ExternalLogin already exists
            // ========================================================

            var externalLogin =
                await _externalLoginRepository.GetByProviderAsync(
                    command.Provider,
                    command.ProviderKey,
                    cancellationToken);

            // ========================================================
            // 2. Existing External Login
            // ========================================================

            if (externalLogin != null)
            {
                var existingUser = externalLogin.User;

                if (!existingUser.IsActive)
                {
                    return new ApiResponse<LoginResponse>
                    {
                        IsSuccess = false,
                        Error = "Your account is inactive."
                    };
                }

                var token =
                    _jwtTokenService.GenerateToken(existingUser);

                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = true,
                    Data = new LoginResponse
                    {
                        UserId = existingUser.Id,
                        FullName =
                            $"{existingUser.FirstName} {existingUser.LastName}",
                        Email = existingUser.Email,
                        Role = existingUser.Role.Name,
                        Token = token
                    }
                };
            }

            // ========================================================
            // 3. Check BisiPro User by Email
            // ========================================================

            var user =
                await _userRepository.GetByEmailAsync(
                    command.Email,
                    cancellationToken);

            // ========================================================
            // 4. User does not exist
            // ========================================================

            if (user == null)
            {
                // ----------------------------------------------------
                // Get default Member role
                // ----------------------------------------------------

                var memberRole =
                    await _roleRepository.GetByNameAsync(
                        "Users",
                        cancellationToken);

                if (memberRole == null)
                {
                    return new ApiResponse<LoginResponse>
                    {
                        IsSuccess = false,
                        Error = "Member role was not found."
                    };
                }

                // ----------------------------------------------------
                // Create new BisiPro User
                // ----------------------------------------------------

                user = new User
                {
                    Id = Guid.NewGuid(),

                    FirstName = command.FirstName,

                    LastName = command.LastName,

                    Email = command.Email,

                    PhoneNumber = string.Empty,

                    // OAuth user does not need a local password
                    PasswordHash = string.Empty,

                    IsActive = true,

                    RoleId = memberRole.Id,

                    Role = memberRole, 
                    CreatedAt  = DateTime.UtcNow
                };

                await _userRepository.AddAsync(
                    user,
                    cancellationToken);

                await _userRepository.SaveChangesAsync(
                    cancellationToken);
            }

            // ========================================================
            // 5. Existing BisiPro user must be active
            // ========================================================

            if (!user.IsActive)
            {
                return new ApiResponse<LoginResponse>
                {
                    IsSuccess = false,
                    Error = "Your account is inactive."
                };
            }

            // ========================================================
            // 6. Create ExternalLogin relationship
            // ========================================================

            var newExternalLogin =
                new Domain.Entities.ExternalLogin
                {
                    Id = Guid.NewGuid(),

                    UserId = user.Id,

                    Provider = command.Provider,

                    ProviderKey = command.ProviderKey,
                    CreatedAt = DateTime.UtcNow
                };

            await _externalLoginRepository.AddAsync(
                newExternalLogin,
                cancellationToken);

            await _externalLoginRepository.SaveChangesAsync(
                cancellationToken);

            // ========================================================
            // 7. Generate BisiPro JWT
            // ========================================================

            var jwtToken =
                _jwtTokenService.GenerateToken(user);

            // ========================================================
            // 8. Return Login Response
            // ========================================================

            return new ApiResponse<LoginResponse>
            {
                IsSuccess = true,
                Data = new LoginResponse
                {
                    UserId = user.Id,

                    FullName =
                        $"{user.FirstName} {user.LastName}",

                    Email = user.Email,

                    Role = user.Role.Name,

                    Token = jwtToken
                }
            };
        }
    }
}