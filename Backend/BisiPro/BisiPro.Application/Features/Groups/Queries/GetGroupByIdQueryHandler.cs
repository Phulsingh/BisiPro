using BisiPro.Application.Features.Groups.Queries;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using MediatR;
using BisiPro.Contracts.DTO_s.Groups;
using BisiPro.Application.Mappings;
public class GetGroupByIdQueryHandler
    : IRequestHandler<
        GetGroupByIdQuery,
        ApiResponse<GroupResponse>>
{
    private readonly IGroupRepository _groupRepository;

    public GetGroupByIdQueryHandler(
        IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task<ApiResponse<GroupResponse>> Handle(
        GetGroupByIdQuery request,
        CancellationToken cancellationToken)
    {
        var group = await _groupRepository.GetDetailsByIdAsync(
            request.GroupId,
            cancellationToken);

        if (group == null)
        {
            return new ApiResponse<GroupResponse>
            {
                IsSuccess = false,
                Error = "Group not found."
            };
        }

        var response = group.ToResponse();

        return new ApiResponse<GroupResponse>
        {
            Data = response,
            IsSuccess = true
        };
    }
}