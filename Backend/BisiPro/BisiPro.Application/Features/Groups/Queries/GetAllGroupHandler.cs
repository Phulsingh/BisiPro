using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Queries
{
    public class GetAllGroupsQueryHandler
        : IRequestHandler<
            GetAllGroupsQuery,
            ApiResponse<PagedResponse<GroupResponse>>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetAllGroupsQueryHandler(
            IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<ApiResponse<PagedResponse<GroupResponse>>> Handle(
            GetAllGroupsQuery request,
            CancellationToken cancellationToken)
        {
            var groups = await _groupRepository.GetAllAsync(
                request.Filter,
                cancellationToken);

            return new ApiResponse<PagedResponse<GroupResponse>>
            {
                Data = groups,
                IsSuccess = true
            };
        }
    }
}