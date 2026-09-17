using BisiPro.Application.Features.Groups.Queries;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

public class GetAllGroupsHandler
        :IRequestHandler<
         GetAllGroup,
         ApiResponse<PagedResponse<GroupResponse>>>
{
    private readonly IGroupRepository _groupRepository;

    public GetAllGroupsHandler(IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task<ApiResponse<PagedResponse<GroupResponse>>> Handle(
        GetAllGroup request,
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