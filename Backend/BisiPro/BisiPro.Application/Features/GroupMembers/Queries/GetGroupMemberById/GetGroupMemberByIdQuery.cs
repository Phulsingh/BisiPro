using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.GroupMembers.Queries.GetGroupMemberById
{
    public class GetGroupMemberByIdQuery
       : IRequest<ApiResponse<GroupMemberResponse>>
    {
        public Guid Id { get; }
        public GetGroupMemberByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}
