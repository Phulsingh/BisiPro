using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using BisiPro.Domain.Enums;
using MediatR;

namespace BisiPro.Application.Features.Groups.Commands.RequestToJoinGroup
{
    public class RequestToJoinGroupCommandHandler
        : IRequestHandler<
            RequestToJoinGroupCommand,
            ApiResponse<bool>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _groupMemberRepository;
        private readonly IGroupJoinRequestRepository _groupJoinRequestRepository;

        public RequestToJoinGroupCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository groupMemberRepository,
            IGroupJoinRequestRepository groupJoinRequestRepository)
        {
            _groupRepository = groupRepository;
            _groupMemberRepository = groupMemberRepository;
            _groupJoinRequestRepository = groupJoinRequestRepository;
        }

        public async Task<ApiResponse<bool>> Handle(
            RequestToJoinGroupCommand command,
            CancellationToken cancellationToken)
        {
            // 1. Check Group
            var group = await _groupRepository.GetDetailsByIdAsync(
                command.GroupId,
                cancellationToken);

            if (group == null)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    Error = "Group not found."
                };
            }

            // 2. Check Group is Active
            if (!group.IsActive)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    Error = "This group is not active."
                };
            }

            // 3. Check whether User is already a member
            var isMember =
                await _groupMemberRepository.GetByGroupAndUserAsync(
                    command.GroupId,
                    command.UserId,
                    cancellationToken);

            if (isMember != null)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    Error = "You are already a member of this group."
                };
            }

            // 4. Check whether a Pending request already exists
            var hasPendingRequest =
                await _groupJoinRequestRepository
                    .HasPendingRequestAsync(
                        command.GroupId,
                        command.UserId,
                        cancellationToken);

            if (hasPendingRequest)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    Error = "You already have a pending request for this group."
                };
            }

            // 5. Create Join Request
            var joinRequest = new GroupJoinRequest
            {
                GroupId = command.GroupId,
                UserId = command.UserId,
                Status = JoinRequestStatus.Pending,
                RequestedAt = DateTime.UtcNow
            };

            await _groupJoinRequestRepository.AddAsync(
                joinRequest,
                cancellationToken);

            // 6. Save
            await _groupJoinRequestRepository.SaveChangesAsync(
                cancellationToken);

            return new ApiResponse<bool>
            {
                Data = true,
                IsSuccess = true
            };
        }
    }
}