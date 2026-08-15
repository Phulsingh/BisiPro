using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.Queries
{
    public  class GetAllGroupsQuery :IRequest<PagedResponse<GroupResponse>>
    {
        public Guid AgentId { get; }
        public GroupFilterRequest Filter { get; }
        public GetAllGroupsQuery(Guid agentId, GroupFilterRequest filter)
        {
            AgentId = agentId;
            Filter = filter;
        }
    }
}
