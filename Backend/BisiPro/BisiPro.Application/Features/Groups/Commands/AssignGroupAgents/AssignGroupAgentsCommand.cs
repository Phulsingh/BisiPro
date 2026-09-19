using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupAgents;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.Commands.AssignGroupAgents
{
    public class AssignGroupAgentsCommand : IRequest<ApiResponse<bool>>
    {
        public Guid GroupId { get; }
        public AssignGroupAgentsRequest Request { get; }
        public AssignGroupAgentsCommand(
            Guid groupId,
            AssignGroupAgentsRequest request)
        {
            GroupId = groupId;
            Request = request;
        }
    }
}
