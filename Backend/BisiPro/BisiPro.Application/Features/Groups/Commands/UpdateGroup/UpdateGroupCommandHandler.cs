using BisiPro.Application.Features.Groups.Queries;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using BisiPro.Application.Mappings;

public class GetAllGroupsQueryHandler
    : IRequestHandler<
        GetAllGroupsQuery,
        PagedResponse<GroupResponse>>
{
    private readonly IGroupRepository _groupRepository;

    public GetAllGroupsQueryHandler(
        IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task<PagedResponse<GroupResponse>> Handle(
        GetAllGroupsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _groupRepository.GetByAgentIdAsync(
            query.AgentId,
            query.Filter,
            cancellationToken);

        return new PagedResponse<GroupResponse>
        {
            Data = result.Data
                   .Select(group => group.ToResponse())
                   .ToList(),

            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = result.TotalPages,
            IsSuccess = true
        };
    }
}