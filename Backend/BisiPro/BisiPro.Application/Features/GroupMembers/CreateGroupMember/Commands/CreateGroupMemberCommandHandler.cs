using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Application.Mappings;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupMembers;
using BisiPro.Domain.Entities;
using BisiPro.Domain.Enums;
using MediatR;

namespace BisiPro.Application.Features.GroupMembers.CreateGroupMember.Commands
{
    public class CreateGroupMemberCommandHandler
        : IRequestHandler<
            CreateGroupMemberCommand,
            ApiResponse<GroupMemberResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGroupMemberRepository _groupMemberRepository;

        public CreateGroupMemberCommandHandler(
            IGroupRepository groupRepository,
            IUserRepository userRepository,
            IGroupMemberRepository groupMemberRepository)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _groupMemberRepository = groupMemberRepository;
        }

        public async Task<ApiResponse<GroupMemberResponse>> Handle(
            CreateGroupMemberCommand command,
            CancellationToken cancellationToken)
        {
            // 1. Get Group
            var group = await _groupRepository.GetByIdAsync(
                command.GroupId,
                cancellationToken);

            if (group == null)
            {
                throw new KeyNotFoundException(
                    "Group not found.");
            }

            // 2. Verify Agent owns the Group
            if (group.AgentId != command.AgentId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to add members to this group.");
            }

            // 3. Get User
            var user = await _userRepository.GetByIdAsync(
                command.Request.UserId,
                cancellationToken);

            if (user == null)
            {
                throw new KeyNotFoundException(
                    "User not found.");
            }

            // 4. Check KYC
            if (user.KycStatus != KycStatus.Completed)
            {
                throw new ArgumentException(
                    "User KYC must be completed before joining a group.");
            }

            // 5. Check if User is already a member
            var existingMember =
                await _groupMemberRepository.GetByGroupAndUserAsync(
                    command.GroupId,
                    command.Request.UserId,
                    cancellationToken);

            if (existingMember != null)
            {
                throw new ArgumentException(
                    "User is already a member of this group.");
            }

            // 6. Check Group capacity
            var activeMemberCount =
                await _groupMemberRepository.GetActiveMemberCountAsync(
                    command.GroupId,
                    cancellationToken);

            if (activeMemberCount >= group.TotalMembers)
            {
                throw new ArgumentException(
                    "This group has reached its maximum member capacity.");
            }

            // 7. Calculate Payable Amount
            if (group.TotalMembers <= 0)
            {
                throw new ArgumentException(
                    "Group member capacity must be greater than zero.");
            }

            var payableAmount =
                group.MonthlyAmount / group.TotalMembers;

            // 8. Create GroupMember
            var groupMember = new GroupMember
            {
                GroupId = group.Id,
                UserId = user.Id,
                PayableAmount = payableAmount,
                JoinedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                IsActive = true
            };

            // 9. Save
            await _groupMemberRepository.AddAsync(
                groupMember,
                cancellationToken);

            await _groupMemberRepository.SaveChangesAsync(
                cancellationToken);

            // 10. Return Response
            return new ApiResponse<GroupMemberResponse>
            {
                IsSuccess = true,
                Data = groupMember.ToResponse()
            };
        }
    }
}