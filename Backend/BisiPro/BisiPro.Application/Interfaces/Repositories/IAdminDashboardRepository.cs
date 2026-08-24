using BisiPro.Contracts.DTO_s.AdminDashboard;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Interfaces.Repositories
{
    public interface IAdminDashboardRepository
    {
        Task<int> GetTotalGroupsAsync(
          CancellationToken cancellationToken);
        Task<int> GetTotalActiveGroupsAsync(
          CancellationToken cancellationToken);
        Task<int> GetTotalMembersAsync(
            CancellationToken cancellationToken);
        Task<int> GetTotalActiveMembersAsync(
            CancellationToken cancellationToken);

        Task<List<RecentGroupResponse>> GetRecentGroupsAsync(
            int count,
            CancellationToken cancellationToken);

        Task<List<RecentMemberResponse>> GetRecentMembersAsync(
            int count,
            CancellationToken cancellationToken);
    }
}
