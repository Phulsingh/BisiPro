using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries.GetAssignedAgentIds
{
    public class GetAssignedAgentIdsQueryHandler
        : IRequestHandler<
            GetAssignedAgentIdsQuery,
            ApiResponse<List<Guid>>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupAgentRepository _groupAgentRepository;

        public GetAssignedAgentIdsQueryHandler(
            IGroupRepository groupRepository,
            IGroupAgentRepository groupAgentRepository)
        {
            _groupRepository = groupRepository;
            _groupAgentRepository = groupAgentRepository;
        }

        public async Task<ApiResponse<List<Guid>>> Handle(
            GetAssignedAgentIdsQuery request,
            CancellationToken cancellationToken)
        {
            // Check whether Group exists
            var group = await _groupRepository.GetDetailsByIdAsync(
                request.GroupId,
                cancellationToken);

            if (group == null)
            {
                return new ApiResponse<List<Guid>>
                {
                    IsSuccess = false,
                    Error = "Group not found."
                };
            }

            var agentIds =
                await _groupAgentRepository.GetAgentIdsByGroupIdAsync(
                    request.GroupId,
                    cancellationToken);

            return new ApiResponse<List<Guid>>
            {
                Data = agentIds,
                IsSuccess = true
            };
        }
    }
}