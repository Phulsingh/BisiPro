using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Application.Mappings;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Users;
using MediatR;

namespace BisiPro.Application.Features.Users.Queries.GetUserById
{
    public class GetUserByIdQueryHandler
        : IRequestHandler<
            GetUserByIdQuery,
            ApiResponse<UserResponse>>
    {
        private readonly IUserRepository _userRepository;

        public GetUserByIdQueryHandler(
            IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<UserResponse>> Handle(
            GetUserByIdQuery query,
            CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(
                query.Id,
                cancellationToken);

            if (user == null)
            {
                return new ApiResponse<UserResponse>
                {
                    IsSuccess = false,
                    Error = "User not found."
                };
            }

            return new ApiResponse<UserResponse>
            {
                IsSuccess = true,
                Data = user.ToResponse()
            };
        }
    }
}