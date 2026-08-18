using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Filters
{
    public class GroupMemberFilter
    {
            public string? Name { get; set; }
            public Guid? GroupId { get; set; }
            public Guid? AgentId { get; set; }
            public bool? IsActive { get; set; }
            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 20;
        
    }
}
