using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Commands.CreateGroup
{
   public class CreateGroupCommand : IRequest<ApiResponse<CreateGroupResponse>>
    {
        public CreateGroupRequest Request { get; }
        public Guid AgentId { get; }

        public CreateGroupCommand(CreateGroupRequest request, Guid agentId)
        {
            Request = request;
            AgentId = agentId;
        }
    }
}
