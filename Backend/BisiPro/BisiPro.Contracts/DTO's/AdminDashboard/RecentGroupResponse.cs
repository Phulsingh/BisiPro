using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.AdminDashboard
{
    public class RecentGroupResponse
    {
        public Guid Id { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
