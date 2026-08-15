using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.Groups
{
    public class CreateGroupResponse
    {
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
