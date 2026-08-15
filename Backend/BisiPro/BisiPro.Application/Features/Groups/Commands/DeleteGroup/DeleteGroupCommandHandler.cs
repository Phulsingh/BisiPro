using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Groups.Commands.DeleteGroup
{
    public class DeleteGroupCommandHandler
        : IRequestHandler<
            DeleteGroupCommand,
            ApiResponse<object>>
    {
        private readonly IGroupRepository _groupRepository;

        public DeleteGroupCommandHandler(
            IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<ApiResponse<object>> Handle(
            DeleteGroupCommand command,
            CancellationToken cancellationToken)
        {
            // Step 1: Find the group
            var group = await _groupRepository.GetByIdAsync(
                command.GroupId,
                cancellationToken);

            // Step 2: Check group exists
            if (group == null)
            {
                return new ApiResponse<object>
                {
                    IsSuccess = false,
                    Error = "Group not found."
                };
            }

            // Step 3: Check ownership
            if (group.AgentId != command.AgentId)
            {
                return new ApiResponse<object>
                {
                    IsSuccess = false,
                    Error = "You are not authorized to delete this group."
                };
            }

            // Step 4: Soft Delete
            group.IsActive = false;

            // Step 5: Update
            await _groupRepository.UpdateAsync(
                group,
                cancellationToken);

            // Step 6: Save
            await _groupRepository.SaveChangesAsync(
                cancellationToken);

            // Step 7: Return response
            return new ApiResponse<object>
            {
                IsSuccess = true,
                Data = null
            };
        }
    }
    }
