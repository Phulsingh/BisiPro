using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using BisiPro.Application.Mappings;

namespace BisiPro.Application.Features.Groups.Queries
{
    public class GetAllGroupsQueryHandler : IRequestHandler<GetAllGroupsQuery, PagedResponse<GroupResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        public GetAllGroupsQueryHandler(
            IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

       
        public async Task<PagedResponse<GroupResponse>> Handle(
            GetAllGroupsQuery query, CancellationToken cancellationToken)
        {
            // Get filtered + sorted + paginated groups
            var groups = await _groupRepository.GetByAgentIdAsync(
                query.AgentId,
                query.Filter,
                cancellationToken);

            // Map to response DTO
            var response = groups.Data
                .Select(group => group.ToResponse())
                .ToList();

            // Return paginated response
            return new PagedResponse<GroupResponse>
            {
                Data = response,
                PageNumber = groups.PageNumber,
                PageSize = groups.PageSize,
                TotalCount = groups.TotalCount,
                TotalPages = groups.TotalPages,
                IsSuccess = true
            };

        }
    }
}
