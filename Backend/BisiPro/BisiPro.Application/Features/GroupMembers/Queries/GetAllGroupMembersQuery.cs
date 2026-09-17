using BisiPro.Application.Filters;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;

namespace BisiPro.Application.Features.GroupMembers.Queries
{
    public class GetAllGroupMembersQuery : IRequest<PagedResponse<GroupMemberResponse>>
    {
        public Guid AgentId { get; }
        public GroupMemberFilter Filter { get; }

        public GetAllGroupMembersQuery(
           Guid agentId,
           GroupMemberFilter filter)
        {
            AgentId = agentId;
            Filter = filter;
        }
    }
}
