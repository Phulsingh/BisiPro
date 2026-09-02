using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Application.Mappings;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using BisiPro.Domain.Entities;
using BisiPro.Domain.Enums;
using MediatR;

namespace BisiPro.Application.Features.Groups.Commands.CreateGroup
{
    public class CreateGroupCommandHandler :IRequestHandler<CreateGroupCommand, ApiResponse<CreateGroupResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IActivityLogRepository _activityLogRepository;

        public CreateGroupCommandHandler(IGroupRepository groupRepository, IActivityLogRepository activityLogRepository)
        {
            _groupRepository = groupRepository;
            _activityLogRepository = activityLogRepository;
        }

        public async Task<ApiResponse<CreateGroupResponse>> Handle(CreateGroupCommand command, CancellationToken cancellationToken)
        {
            // Step 1 : Check if Group Name already exists
            var groupExist = await _groupRepository.ExistsByNameAsync         (command.Request.GroupName, cancellationToken);

            if (groupExist)
            {
                return new ApiResponse<CreateGroupResponse>
                {
                    IsSuccess = false,
                    Error = "Group name already exists."
                };
            }

            var group = command.Request.ToEntity(command.AgentId);
            group.CreatedAt = DateTime.UtcNow;

            // Step 3 : Save Group
            await _groupRepository.AddAsync(
                group,
                cancellationToken);

            await _groupRepository.SaveChangesAsync(
              cancellationToken);

            // 4. Create Activity Log
            var activityLog = new ActivityLog
            {
                ActivityType = ActivityType.GroupCreated,
                Message =
                    $"Group '{group.GroupName}' created successfully.",
                UserId = command.AgentId,
                CreatedAt = DateTime.UtcNow
            };

            await _activityLogRepository.AddAsync(
                activityLog,
                cancellationToken);

            await _activityLogRepository.SaveChangesAsync(
                cancellationToken);

            // Step 4 : Return Response
            return new ApiResponse<CreateGroupResponse>
            {
                IsSuccess = true,
                Data = new CreateGroupResponse
                {
                    GroupId = group.Id,
                    GroupName = group.GroupName,
                    Message = "Group created successfully."
                }
            };

        }
    }
}
