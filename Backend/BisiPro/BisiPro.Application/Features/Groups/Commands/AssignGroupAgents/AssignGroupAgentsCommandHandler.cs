using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Contracts.Common;
using BisiPro.Domain.Entities;
using MediatR;

namespace BisiPro.Application.Features.Groups.Commands.AssignGroupAgents
{
    public class AssignGroupAgentsCommandHandler
        : IRequestHandler<
            AssignGroupAgentsCommand,
            ApiResponse<bool>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupAgentRepository _groupAgentRepository;
        private readonly IUserRepository _userRepository;

        public AssignGroupAgentsCommandHandler(
            IGroupRepository groupRepository,
            IGroupAgentRepository groupAgentRepository,
            IUserRepository userRepository)
        {
            _groupRepository = groupRepository;
            _groupAgentRepository = groupAgentRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<bool>> Handle(
            AssignGroupAgentsCommand command,
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

            // 2. Remove duplicate Agent IDs
            var agentIds = command.Request.AgentIds
                .Distinct()
                .ToList();

            // 3. Validate selected Agents
            var validAgents =
                await _userRepository.GetActiveAgentsByIdsAsync(
                    agentIds,
                    cancellationToken);

            if (validAgents.Count != agentIds.Count)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    Error = "One or more selected users are not valid Agents."
                };
            }

            // 4. Get existing assignments
            var existingAssignments =
                await _groupAgentRepository.GetByGroupIdAsync(
                    command.GroupId,
                    cancellationToken);

            var existingAgentIds = existingAssignments
                .Select(x => x.AgentId)
                .ToHashSet();

            var selectedAgentIds = agentIds.ToHashSet();

            // 5. Find assignments to remove
            var assignmentsToRemove = existingAssignments
                .Where(x => !selectedAgentIds.Contains(x.AgentId))
                .ToList();

            // 6. Find Agents to add
            var assignmentsToAdd = selectedAgentIds
                .Where(agentId => !existingAgentIds.Contains(agentId))
                .Select(agentId => new GroupAgent
                {
                    GroupId = command.GroupId,
                    AgentId = agentId,
                    CreatedAt = DateTime.UtcNow
                })
                .ToList();

            // 7. Remove old assignments
            if (assignmentsToRemove.Count > 0)
            {
                _groupAgentRepository.RemoveRange(
                    assignmentsToRemove);
            }

            // 8. Add new assignments
            if (assignmentsToAdd.Count > 0)
            {
                await _groupAgentRepository.AddRangeAsync(
                    assignmentsToAdd,
                    cancellationToken);
            }
            

            // 9. Save
            await _groupAgentRepository.SaveChangesAsync(
                cancellationToken);

            return new ApiResponse<bool>
            {
                Data = true,
                IsSuccess = true
            };
        }
    }
}