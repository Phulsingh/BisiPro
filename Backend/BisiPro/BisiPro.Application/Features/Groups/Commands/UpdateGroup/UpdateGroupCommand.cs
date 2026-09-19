using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;

namespace BisiPro.Application.Features.Groups.Commands.UpdateGroup
{
    public class UpdateGroupCommand
        : IRequest<ApiResponse<CreateGroupResponse>>
    {
        public Guid GroupId { get; }
        public CreateGroupRequest Request { get; }

        public UpdateGroupCommand(
            Guid groupId,
            CreateGroupRequest request)
        {
            GroupId = groupId;
            Request = request;
        }
    }
}