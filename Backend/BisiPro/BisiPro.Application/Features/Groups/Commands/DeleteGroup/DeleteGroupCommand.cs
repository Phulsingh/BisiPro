using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.Commands.DeleteGroup
{
    public class DeleteGroupCommand
        : IRequest<ApiResponse<object>>
    {
        public Guid GroupId { get; }
        public Guid AgentId { get; }

        public DeleteGroupCommand(
            Guid groupId,
            Guid agentId)
        {
            GroupId = groupId;
            AgentId = agentId;
        }
    }
}
