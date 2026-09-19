using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.Users
{
    public class AgentDropdownResponse
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
