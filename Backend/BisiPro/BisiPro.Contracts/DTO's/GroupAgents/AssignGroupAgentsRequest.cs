using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.GroupAgents
{
    public class AssignGroupAgentsRequest
    {
        public List<Guid> AgentIds { get; set; } = new();
    }
}
