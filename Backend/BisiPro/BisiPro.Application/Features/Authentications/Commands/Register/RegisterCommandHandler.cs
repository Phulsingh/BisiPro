using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using MediatR;
using System.Data;

namespace BisiPro.Application.Features.Authentications.Commands.Register
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ApiResponse<RegisterResponse>>
    {
        private readonly IPasswordService _passwordService;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public RegisterCommandHandler(IPasswordService passwordService, IRoleRepository roleRepository, IUserRepository userRepository)
        {
            _passwordService = passwordService;
            _roleRepository = roleRepository;
            _userRepository = userRepository;

        }

        public async Task<ApiResponse<RegisterResponse>> Handle(
            RegisterCommand command,
            CancellationToken cancellationToken)
        {
            var emailExist = await _userRepository.ExistsByEmailAsync(command.Request.Email, cancellationToken);

            if (emailExist)
            {
                return new ApiResponse<RegisterResponse>
                {
                    IsSuccess = false,
                    Error = "Email already exists."
                };
            }

            Role? role = null;

            if (command.Request.RoleId.HasValue)
            {
                role = await _roleRepository.GetByIdAsync(
                    command.Request.RoleId.Value,
                    cancellationToken);
            }
            else
            {
                role = await _roleRepository.GetByNameAsync(
                    "Users",// Change to "Agent" if Agent is your default role
                    cancellationToken);
            }


            if (role == null)
            {
                return new ApiResponse<RegisterResponse>
                {
                    IsSuccess = false,
                    Error = "Default role 'Agent' not found."
                };
            }

            var user = new User
            {
                FirstName = command.Request.FirstName,
                LastName = command.Request.LastName,
                Email = command.Request.Email,
                DateOfBirth = command.Request.DateOfBirth,
                PhoneNumber = command.Request.PhoneNumber,
                RoleId = role.Id,
                IsActive = true,
            };


            // Step 4 : Hash Password
            user.PasswordHash = _passwordService.HashPassword(
                user,
                command.Request.Password);

            // Step 5 : Save User
            await _userRepository.AddAsync(
                user,
                cancellationToken);


            await _userRepository.SaveChangesAsync(
                cancellationToken);


            // Step 6 : Return Response
            return new ApiResponse<RegisterResponse>
            {
                IsSuccess = true,
                Data = new RegisterResponse
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Message = "User registered successfully."
                }
            };
        }

    }
}
