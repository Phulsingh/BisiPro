using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.Commands.RequestToJoinGroup
{
    public class RequestToJoinGroupCommand : IRequest<ApiResponse<bool>>
    {
        public Guid GroupId { get; }
        public Guid UserId { get; }

        public RequestToJoinGroupCommand(
            Guid groupId,
            Guid userId)
        {
            GroupId = groupId;
            UserId = userId;
        }
    }
}
