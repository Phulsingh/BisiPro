
using BisiPro.Domain.Base;
using BisiPro.Domain.Enums;

namespace BisiPro.Domain.Entities
{
    public class Group : AuditableEntity
    {
        public required string GroupName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public BisiType BisiType { get; set; }
        public decimal MonthlyAmount { get; set; }
        public int TotalMembers { get; set; }
        public int DurationInMonths { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int CollectionDay { get; set; }
        public int? AuctionDay { get; set; }
        public decimal LateFee { get; set; }
        public int GracePeriod { get; set; }
        public bool IsActive { get; set; } = true;

        // Group Assingment to Agents
        public ICollection<GroupAgent> GroupAgents { get; set; }
        = new List<GroupAgent>();

        // Group Members
        public ICollection<GroupMember> Members { get; set; }
                 = new List<GroupMember>();
    }
}
