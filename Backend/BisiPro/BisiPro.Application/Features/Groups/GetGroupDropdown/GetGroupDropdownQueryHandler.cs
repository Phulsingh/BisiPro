using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.GetGroupDropdown
{
    public class GetGroupDropdownQueryHandler : 
            IRequestHandler<GetGroupDropdownQuery, 
            ApiResponse<List<GroupDropdownResponse>>>
    {
        private readonly IGroupRepository _groupRepository;
        public GetGroupDropdownQueryHandler(
           IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<ApiResponse<List<GroupDropdownResponse>>> Handle(
            GetGroupDropdownQuery query,
            CancellationToken cancellationToken)
        {
            var groups = await _groupRepository.GetDropdownByAgentIdAsync(
                query.AgentId,
                cancellationToken);

            return new ApiResponse<List<GroupDropdownResponse>>
            {
                IsSuccess = true,
                Data = groups
            };
        }
    }
}
