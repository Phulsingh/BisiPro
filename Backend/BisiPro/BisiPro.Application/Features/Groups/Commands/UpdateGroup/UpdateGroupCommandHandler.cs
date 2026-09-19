using BisiPro.Application.Features.Groups.Commands.UpdateGroup;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

public class UpdateGroupCommandHandler
    : IRequestHandler<
        UpdateGroupCommand,
        ApiResponse<CreateGroupResponse>>
{
    private readonly IGroupRepository _groupRepository;

    public UpdateGroupCommandHandler(
        IGroupRepository groupRepository)
    {
        _groupRepository = groupRepository;
    }

    public async Task<ApiResponse<CreateGroupResponse>> Handle(
        UpdateGroupCommand command,
        CancellationToken cancellationToken)
    {
        var group = await _groupRepository.GetDetailsByIdAsync(
            command.GroupId,
            cancellationToken);

        if (group == null)
        {
            return new ApiResponse<CreateGroupResponse>
            {
                IsSuccess = false,
                Error = "Group not found."
            };
        }

        // Update properties
        group.GroupName = command.Request.GroupName;
        group.Description = command.Request.Description;
        group.BisiType = command.Request.BisiType;
        group.MonthlyAmount = command.Request.MonthlyAmount;
        group.TotalMembers = command.Request.TotalMembers;
        group.DurationInMonths = command.Request.DurationInMonths;
        group.StartDate = command.Request.StartDate;
        group.EndDate = command.Request.EndDate;
        group.CollectionDay = command.Request.CollectionDay;
        group.AuctionDay = command.Request.AuctionDay;
        group.LateFee = command.Request.LateFee;
        group.GracePeriod = command.Request.GracePeriod;

        await _groupRepository.UpdateAsync(
            group,
            cancellationToken);

        await _groupRepository.SaveChangesAsync(
            cancellationToken);

        return new ApiResponse<CreateGroupResponse>
        {
            IsSuccess = true,
            Data = new CreateGroupResponse
            {
                GroupId = group.Id,
                GroupName = group.GroupName,
                Message = "Group updated successfully."
            }
        };
    }
}
