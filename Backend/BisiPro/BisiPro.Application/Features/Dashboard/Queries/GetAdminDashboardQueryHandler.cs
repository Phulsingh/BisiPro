using BisiPro.Application.Features.Dashboard.Response;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.AdminDashboard;
using MediatR;


namespace BisiPro.Application.Features.Dashboard.Queries
{
    internal class GetAdminDashboardQueryHandler : IRequestHandler<
            GetAdminDashboardQuery,
            ApiResponse<AdminDashboardResponse>>
    {
        private readonly IAdminDashboardRepository _dashboardRepository;
        public GetAdminDashboardQueryHandler(
            IAdminDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<ApiResponse<AdminDashboardResponse>> Handle(
            GetAdminDashboardQuery request,
            CancellationToken cancellationToken)
        {
            var totalGroups = await _dashboardRepository.GetTotalGroupsAsync(cancellationToken);
            var totalActiveGroups = await _dashboardRepository.GetTotalActiveGroupsAsync(cancellationToken);
            var totalMembers = await _dashboardRepository.GetTotalMembersAsync(cancellationToken);
            var totalActiveMembers = await _dashboardRepository.GetTotalActiveMembersAsync(cancellationToken);
            var recentGroups = await _dashboardRepository.GetRecentGroupsAsync(5, cancellationToken);
            var recentMembers = await _dashboardRepository.GetRecentMembersAsync(5, cancellationToken);

            return new ApiResponse<AdminDashboardResponse>
            {
                IsSuccess = true,
                Data =  new AdminDashboardResponse
                {
                    Summary = new DashboardSummaryResponse
                    {
                        TotalGroups = totalGroups,
                        TotalActiveGroups = totalActiveGroups,
                        TotalMembers = totalMembers,
                        TotalActiveMembers = totalActiveMembers
                    },
                    RecentGroups = recentGroups,
                    RecentMembers = recentMembers
                }
            };

        }


    }
}
