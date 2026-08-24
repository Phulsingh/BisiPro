using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.AdminDashboard
{
    public class DashboardSummaryResponse
    {
        public int TotalGroups { get; set; }
        public int TotalMembers { get; set; }
        public int TotalActiveGroups { get; set; }
        public int TotalActiveMembers { get; set; }
    }
}
