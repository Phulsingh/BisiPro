using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Application.Mappings;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;


namespace BisiPro.Application.Features.GroupMembers.Queries.GetGroupMemberById
{
    internal class GetGroupMemberByIdQueryHandler : IRequestHandler<
            GetGroupMemberByIdQuery,
            ApiResponse<GroupMemberResponse>>
    {
        private readonly IGroupMemberRepository _groupMemberRepository;
        public GetGroupMemberByIdQueryHandler(
           IGroupMemberRepository groupMemberRepository)
        {
            _groupMemberRepository = groupMemberRepository;
        }

        public async Task<ApiResponse<GroupMemberResponse>> Handle(
           GetGroupMemberByIdQuery query,
           CancellationToken cancellationToken)
        {
            //Get GroupMember
            var groupMember = await _groupMemberRepository.GetByIdAsync(query.Id, cancellationToken);

            // Check if GroupMember exists
            if(groupMember == null)
            {
                return new ApiResponse<GroupMemberResponse>
                {
                    IsSuccess = false,
                    Error = "Group Member Does not Found"
                };
            }

            // Return Response
            return new ApiResponse<GroupMemberResponse>
            {
                IsSuccess = true,
                Data = groupMember.ToResponse()
            };

        }

    }
}
