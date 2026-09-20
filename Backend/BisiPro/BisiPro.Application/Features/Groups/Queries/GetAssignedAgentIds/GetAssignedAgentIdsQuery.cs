using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries.GetAssignedAgentIds
{
    public class GetAssignedAgentIdsQuery
        : IRequest<ApiResponse<List<Guid>>>
    {
        public Guid GroupId { get; }

        public GetAssignedAgentIdsQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}