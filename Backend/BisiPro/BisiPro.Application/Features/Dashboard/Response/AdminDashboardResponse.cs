using BisiPro.Contracts.DTO_s.AdminDashboard;


namespace BisiPro.Application.Features.Dashboard.Response
{
    public class AdminDashboardResponse
    {
        public DashboardSummaryResponse Summary { get; set; } = new();
        public List<RecentGroupResponse> RecentGroups { get; set; } = new();
        public List<RecentMemberResponse> RecentMembers { get; set; } = new();

        //public List<RecentActivityResponse> RecentActivities { get; set; } = new();

        //public List<GroupsByBisiTypeResponse> GroupsByBisiType { get; set; } = new();
        //public KycOverviewResponse Kyc { get; set; } = new();
        //public GroupCapacityResponse GroupCapacity { get; set; } = new();
    }
}
