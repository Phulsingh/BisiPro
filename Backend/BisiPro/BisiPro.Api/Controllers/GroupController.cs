using BisiPro.Application.Features.Groups;
using BisiPro.Application.Features.Groups.Commands.AssignGroupAgents;
using BisiPro.Application.Features.Groups.Commands.CreateGroup;
using BisiPro.Application.Features.Groups.Commands.DeleteGroup;
using BisiPro.Application.Features.Groups.Commands.RequestToJoinGroup;
using BisiPro.Application.Features.Groups.Commands.UpdateGroup;
using BisiPro.Application.Features.Groups.GetGroupDropdown;
using BisiPro.Application.Features.Groups.Queries;
using BisiPro.Application.Features.Groups.Queries.GetAgentGroups;
using BisiPro.Application.Features.Groups.Queries.GetAssignedAgentIds;
using BisiPro.Contracts.DTO_s.GroupAgents;
using BisiPro.Contracts.DTO_s.Groups;
//using System.IdentityModel.Tokens.Jwt;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BisiPro.Api.Controllers 
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class GroupController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<GroupController> _logger;

        public GroupController(IMediator mediator, ILogger<GroupController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            //var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            var command = new CreateGroupCommand(request, Guid.Parse(userId));
            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAllGroupAsync(
        //    [FromQuery] GroupFilterRequest filter,
        //    CancellationToken cancellationToken)
        //{
        //    var agentIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    if (string.IsNullOrEmpty(agentIdValue))
        //    {
        //        return Unauthorized();
        //    }

        //    var agentId = Guid.Parse(agentIdValue);

        //    // Create Query
        //    var query = new GetAllGroupsQuery(
        //        agentId,
        //        filter);

        //    // Send Query to MediatR
        //    var result = await _mediator.Send(
        //        query,
        //        cancellationToken);

        //    return Ok(result);
        //}


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetGroupById(
        Guid id,
        CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(
                new GetGroupByIdQuery(id),
                cancellationToken);

            if (!result.IsSuccess)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllGroups(
        [FromQuery] GroupFilterRequest filter,
        CancellationToken cancellationToken)
        {
            // Get current logged-in user's ID from JWT
            var userIdClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }
            // Agent
            if (User.IsInRole("Agent"))
            {
                var agentQuery = new GetAgentGroupsQuery(
                    userId,
                    filter);

                var agentResult = await _mediator.Send(
                    agentQuery,
                    cancellationToken);

                return Ok(agentResult);
            }

                var adminQuery = new GetAllGroupsQuery(filter);

                var adminResult = await _mediator.Send(
                    adminQuery,
                    cancellationToken);

                return Ok(adminResult);

        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateGroup(
       Guid id,
       [FromBody] CreateGroupRequest request,
       CancellationToken cancellationToken)
        {
            var command = new UpdateGroupCommand(
                id,
                request);

            var result = await _mediator.Send(
                command,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var agentIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(agentIdValue))
            {
                return Unauthorized();
            }
            var agentId = Guid.Parse(agentIdValue);
            var command = new DeleteGroupCommand(id, agentId);
            var result = await _mediator.Send(command, cancellationToken);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpGet("dropdown")]
        public async Task<IActionResult> GetGroupDropdown(CancellationToken cancellationToken)
        {
            _logger.LogInformation(
             "Get Group dropdown request received.");

            var agentIdValue =  User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(agentIdValue))
            {
                _logger.LogWarning(
                    "AgentId was not found in JWT.");

                return Unauthorized();
            }

            if (!Guid.TryParse(agentIdValue, out var agentId))
            {
                _logger.LogWarning(
                    "Invalid AgentId found in JWT: {AgentIdValue}",
                    agentIdValue);

                return Unauthorized();
            }
            var query = new GetGroupDropdownQuery(agentId);
            var result = await _mediator.Send(query ,cancellationToken);
            _logger.LogInformation(
            "Group dropdown retrieved successfully for AgentId: {AgentId}",
             agentId);

            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/assign-agents")]
        public async Task<IActionResult> AssignAgents(
       Guid id,
       [FromBody] AssignGroupAgentsRequest request,
        CancellationToken cancellationToken)
        {
            var command = new AssignGroupAgentsCommand(
                id,
                request);

            var result = await _mediator.Send(
                command,
                cancellationToken);

            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:guid}/assigned-agent-ids")]
        public async Task<IActionResult> GetAssignedAgentIds(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAssignedAgentIdsQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }


        [Authorize(Roles = "Users")]
        [HttpPost("{id:guid}/join")]
        public async Task<IActionResult> RequestToJoinGroup(
        Guid id,
        CancellationToken cancellationToken)
        {
            // Get logged-in User ID from JWT
            var userIdClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new RequestToJoinGroupCommand(
                id,
                userId);

            var result = await _mediator.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
    }
}
