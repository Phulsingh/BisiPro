using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.GroupMembers
{
    public class GroupMemberResponse
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public string MemberName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public decimal PayableAmount { get; set; }
        public DateOnly JoinedDate { get; set; }
        public DateOnly? ExitDate { get; set; }
        public bool IsActive { get; set; }
    }
}
