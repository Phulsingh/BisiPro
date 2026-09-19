using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries
{
    public class GetAllGroupsQuery
        : IRequest<ApiResponse<PagedResponse<GroupResponse>>>
    {
        public GroupFilterRequest Filter { get; set; }

        public GetAllGroupsQuery(GroupFilterRequest filter)
        {
            Filter = filter;
        }
    }
}