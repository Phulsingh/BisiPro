using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.Users
{
    public class AgentFilterRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? Search { get; set; }
    }
}
