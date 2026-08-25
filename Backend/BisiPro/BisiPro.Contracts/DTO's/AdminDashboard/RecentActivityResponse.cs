using BisiPro.Domain.Enums;

namespace BisiPro.Contracts.DTO_s.AdminDashboard
{
    public class RecentActivityResponse
    {
        public Guid Id { get; set; }
        public ActivityType ActivityType { get; set; }
        public string Message { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public Guid? GroupId { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
