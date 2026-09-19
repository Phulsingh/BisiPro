using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Users;
using MediatR;


namespace BisiPro.Application.Features.Users.Queries.AgentDropdown
{
    public class GetAgentsDropdownQueryHandler : IRequestHandler<
        GetAgentsDropdownQuery,
        ApiResponse<PagedResponse<AgentDropdownResponse>>>
    {
        private readonly IUserRepository _userRepository;
        public GetAgentsDropdownQueryHandler(
        IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<ApiResponse<PagedResponse<AgentDropdownResponse>>> Handle(
        GetAgentsDropdownQuery request,
        CancellationToken cancellationToken)
        {
            var result = await _userRepository.GetAgentsDropdownAsync(
                request.Filter,
                cancellationToken);

            return new ApiResponse<PagedResponse<AgentDropdownResponse>>
            {
                Data = result,
                IsSuccess = true
            };
        }
    }
}
