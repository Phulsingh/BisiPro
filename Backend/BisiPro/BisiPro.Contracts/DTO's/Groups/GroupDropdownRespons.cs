using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.Groups
{
    public class GroupDropdownResponse
    {
        public Guid Id { get; set; }
        public string GroupName { get; set; } = string.Empty;
    }
}
