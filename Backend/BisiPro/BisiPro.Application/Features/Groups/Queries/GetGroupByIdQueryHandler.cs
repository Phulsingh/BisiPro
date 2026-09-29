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
    private readonly IGroupMemberRepository _groupMemberRepository;
    private readonly IGroupJoinRequestRepository _groupJoinRequestRepository;

    public GetGroupByIdQueryHandler(
        IGroupRepository groupRepository,
        IGroupMemberRepository groupMemberRepository,
        IGroupJoinRequestRepository groupJoinRequestRepository)
    {
        _groupRepository = groupRepository;
        _groupMemberRepository = groupMemberRepository;
        _groupJoinRequestRepository = groupJoinRequestRepository;
    }

    public async Task<ApiResponse<GroupResponse>> Handle(
        GetGroupByIdQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Get Group
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

        // 2. Check if current user is already a member
        var existingMember = await _groupMemberRepository.GetByGroupAndUserAsync(request.GroupId, request.UserId, cancellationToken);

        var isMember = existingMember != null;

        // 3. Check if current user has a pending request
        var isRequested =
            await _groupJoinRequestRepository.HasPendingRequestAsync(
                request.GroupId,
                request.UserId,
                cancellationToken);

        // 4. Map Group to Response
        var response = group.ToResponse();
        // 5. Set current user's status
        response.IsMember = isMember;
        response.IsRequested = isRequested;

        return new ApiResponse<GroupResponse>
        {
            Data = response,
            IsSuccess = true
        };
    }
}