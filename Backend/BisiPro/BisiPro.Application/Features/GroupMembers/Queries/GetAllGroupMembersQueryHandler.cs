using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;

namespace BisiPro.Application.Features.GroupMembers.Queries.GetAllGroupMembers
{
    public class GetAllGroupMembersQueryHandler
        : IRequestHandler<
            GetAllGroupMembersQuery,
            PagedResponse<GroupMemberResponse>>
    {
        private readonly IGroupMemberRepository _groupMemberRepository;

        public GetAllGroupMembersQueryHandler(
            IGroupMemberRepository groupMemberRepository)
        {
            _groupMemberRepository = groupMemberRepository;
        }

        public async Task<PagedResponse<GroupMemberResponse>> Handle(
            GetAllGroupMembersQuery request,
            CancellationToken cancellationToken)
        {
            var result = await _groupMemberRepository.GetByAgentIdAsync(
                request.AgentId,
                request.Filter,
                cancellationToken);

            var response = result.Data
                .Select(member => new GroupMemberResponse
                {
                    // Map your properties here
                    Id = member.Id,
                    GroupId = member.GroupId,
                    UserId = member.UserId,
                    MemberName = $"{member.User.FirstName} {member.User.LastName}",
                    PhoneNumber = member.User.PhoneNumber,
                    PayableAmount = member.PayableAmount,
                    JoinedDate = member.JoinedDate,
                    ExitDate = member.ExitDate,
                    IsActive = member.IsActive
                })
                .ToList();

            return new PagedResponse<GroupMemberResponse>
            {
                Data = response,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalCount = result.TotalCount,
                TotalPages = result.TotalPages,
                IsSuccess = true
            };
        }
    }
}