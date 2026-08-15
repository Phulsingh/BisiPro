using BisiPro.Domain.Enums;

namespace BisiPro.Contracts.DTO_s.Groups
{
    public class CreateGroupRequest
    {
        public string GroupName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public BisiType BisiType { get; set; }
        public decimal MonthlyAmount { get; set; }
        public int TotalMembers { get; set; }
        public int DurationInMonths { get; set; }
        public DateOnly StartDate { get; set; }
        public int CollectionDay { get; set; }
        public int? AuctionDay { get; set; }
        public decimal LateFee { get; set; }
        public int GracePeriod { get; set; }
    }
}
