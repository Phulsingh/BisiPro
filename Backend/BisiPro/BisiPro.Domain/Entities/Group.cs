
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
        public Guid AgentId { get; set; }
        public User Agent { get; set; } = null!;

        // Group Members
        public ICollection<GroupMember> Members { get; set; }
                 = new List<GroupMember>();
    }
}
