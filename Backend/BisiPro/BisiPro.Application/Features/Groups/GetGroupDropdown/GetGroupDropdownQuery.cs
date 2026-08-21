using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.GetGroupDropdown
{
    public class GetGroupDropdownQuery
        : IRequest<ApiResponse<List<GroupDropdownResponse>>>
    {
        public Guid AgentId { get; }

        public GetGroupDropdownQuery(Guid agentId)
        {
            AgentId = agentId;
        }
    }
}
