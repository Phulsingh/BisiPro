using BisiPro.Application.Features.GroupMembers.CreateGroupMember.Commands;
using BisiPro.Application.Features.GroupMembers.Queries;
using BisiPro.Application.Filters;
using BisiPro.Contracts.DTO_s.GroupMembers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BisiPro.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GroupMemberController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<GroupMemberController> _logger;

        public GroupMemberController(IMediator mediator, ILogger<GroupMemberController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("{groupId:guid}")]
        public async Task<IActionResult> CreateGroupMember(Guid groupId, [FromBody] AddGroupMemberRequest request)
        {
            _logger.LogInformation(
               "Create GroupMember request received for GroupId: {GroupId}, UserId: {UserId}",
               groupId,
               request.UserId);
            // Get current logged-in AgentId from JWT
            var agentIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(agentIdValue))
            {
                _logger.LogWarning(
                   "AgentId was not found in JWT for GroupId: {GroupId}",
                   groupId);
                return Unauthorized();
            }

            if (!Guid.TryParse(agentIdValue, out var agentId))
            {
                _logger.LogWarning(
                    "Invalid AgentId found in JWT: {AgentIdValue}",
                    agentIdValue);
                return Unauthorized();
            }

            var command = new CreateGroupMemberCommand(
              groupId,
              agentId,
              request);

            var result = await _mediator.Send(command);
            if (!result.IsSuccess)
            {
                _logger.LogWarning(
                   "Failed to add UserId: {UserId} to GroupId: {GroupId}",
                   request.UserId,
                   groupId);
                return BadRequest(result);
            }

            _logger.LogInformation(
                "UserId: {UserId} successfully added to GroupId: {GroupId}",
                request.UserId,
                groupId);

            return Ok(result);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll(
        [FromQuery] GroupMemberFilter filter,
        CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "GetAll GroupMembers request received. PageNumber: {PageNumber}, PageSize: {PageSize}, Search: {Search}, GroupId: {GroupId}",
                filter.PageNumber,
                filter.PageSize,
                filter.Search,
                filter.GroupId);

            // Get current logged-in AgentId from JWT
            var agentIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(agentIdValue))
            {
                _logger.LogWarning(
                    "AgentId was not found in JWT while getting GroupMembers.");

                return Unauthorized();
            }

            if (!Guid.TryParse(agentIdValue, out var agentId))
            {
                _logger.LogWarning(
                    "Invalid AgentId found in JWT while getting GroupMembers. AgentIdValue: {AgentIdValue}",
                    agentIdValue);

                return Unauthorized();
            }

            _logger.LogInformation(
                "Getting GroupMembers for AgentId: {AgentId}",
                agentId);

            // Create Query
            var query = new GetAllGroupMembersQuery(
                agentId,
                filter);

            // Send Query to MediatR
            var result = await _mediator.Send(
                query,
                cancellationToken);

            _logger.LogInformation(
                "GetAll GroupMembers request completed successfully for AgentId: {AgentId}",
                agentId);

            return Ok(result);
        }

    }
}
