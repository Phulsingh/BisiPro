using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using BisiPro.Contracts.DTO_s.Groups;

namespace BisiPro.Application.Features.Groups.Commands.UpdateGroup
{
    public class UpdateGroupCommand :IRequest<ApiResponse<CreateGroupResponse>>
    {
        public Guid GroupId { get; }
        public Guid AgentId { get; }
        public CreateGroupRequest Request { get; }

        public UpdateGroupCommand(
          Guid groupId,
          Guid agentId,
          CreateGroupRequest request)
        {
            GroupId = groupId;
            AgentId = agentId;
            Request = request;
        }
    }
}
