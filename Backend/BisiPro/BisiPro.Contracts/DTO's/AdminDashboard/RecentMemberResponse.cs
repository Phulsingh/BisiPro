using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.AdminDashboard
{
    public class RecentMemberResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;

        public DateOnly JoinedDate { get; set; }
    }
}
