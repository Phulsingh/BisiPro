using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries.GetAgentGroups
{
    public class GetAgentGroupsQuery
        : IRequest<ApiResponse<PagedResponse<GroupResponse>>>
    {
        public Guid AgentId { get; }

        public GroupFilterRequest Filter { get; }

        public GetAgentGroupsQuery(
            Guid agentId,
            GroupFilterRequest filter)
        {
            AgentId = agentId;
            Filter = filter;
        }
    }
}