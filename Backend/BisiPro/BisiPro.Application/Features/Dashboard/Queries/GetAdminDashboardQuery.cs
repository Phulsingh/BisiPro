using BisiPro.Application.Features.Dashboard.Response;
using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Dashboard.Queries
{
    public class GetAdminDashboardQuery
        : IRequest<ApiResponse<AdminDashboardResponse>>
    {
    }
}
