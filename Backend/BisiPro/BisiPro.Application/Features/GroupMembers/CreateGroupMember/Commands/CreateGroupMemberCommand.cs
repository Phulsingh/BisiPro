using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;
using BisiPro.Contracts.Common;

namespace BisiPro.Application.Features.GroupMembers.CreateGroupMember.Commands
{
   public  class CreateGroupMemberCommand :IRequest<ApiResponse<GroupMemberResponse>>
    {
        public Guid GroupId { get; }
        public Guid AgentId { get; }
        public AddGroupMemberRequest Request { get; }

        public CreateGroupMemberCommand(
           Guid groupId,
           Guid agentId,
           AddGroupMemberRequest request)
        {
            GroupId = groupId;
            AgentId = agentId;
            Request = request;
        }
    }
}
