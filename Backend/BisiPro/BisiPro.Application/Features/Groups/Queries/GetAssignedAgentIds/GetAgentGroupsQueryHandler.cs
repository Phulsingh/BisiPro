using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries.GetAgentGroups
{
    public class GetAgentGroupsQueryHandler
        : IRequestHandler<
            GetAgentGroupsQuery,
            ApiResponse<PagedResponse<GroupResponse>>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetAgentGroupsQueryHandler(
            IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<
            ApiResponse<PagedResponse<GroupResponse>>> Handle(
                GetAgentGroupsQuery request,
                CancellationToken cancellationToken)
        {
            var result = await _groupRepository.GetByAgentIdAsync(
                request.AgentId,
                request.Filter,
                cancellationToken);

            return new ApiResponse<PagedResponse<GroupResponse>>
            {
                Data = result,
                IsSuccess = true
            };
        }
    }
}