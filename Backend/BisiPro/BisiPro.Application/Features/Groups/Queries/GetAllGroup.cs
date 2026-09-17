using BisiPro.Contracts.Common;
using MediatR;
using BisiPro.Contracts.DTO_s.Groups;

namespace BisiPro.Application.Features.Groups.Queries
{
    public class GetAllGroup : IRequest<ApiResponse<PagedResponse<GroupResponse>>>
    {
        public GroupFilterRequest Filter { get; set; }

        public GetAllGroup(GroupFilterRequest filter)
        {
            Filter = filter;
        }
    }
}
