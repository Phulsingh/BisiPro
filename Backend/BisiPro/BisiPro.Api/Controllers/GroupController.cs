using BisiPro.Application.Features.Groups;
using BisiPro.Application.Features.Groups.Commands.CreateGroup;
using BisiPro.Application.Features.Groups.Commands.DeleteGroup;
using BisiPro.Application.Features.Groups.Commands.UpdateGroup;
using BisiPro.Application.Features.Groups.Queries;
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

        public GroupController(IMediator mediator)
        {
            _mediator = mediator;
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

        [HttpGet]
        public async Task<IActionResult> GetAllGroupAsync(
            [FromQuery] GroupFilterRequest filter,
            CancellationToken cancellationToken)
        {
            var agentIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(agentIdValue))
            {
                return Unauthorized();
            }

            var agentId = Guid.Parse(agentIdValue);

            // Create Query
            var query = new GetAllGroupsQuery(
                agentId,
                filter);

            // Send Query to MediatR
            var result = await _mediator.Send(
                query,
                cancellationToken);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(
            Guid id,
            [FromBody] CreateGroupRequest request,
            CancellationToken cancellationToken
            )
        {
            var agentIdValue = User
                              .FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(agentIdValue))
            {
                return Unauthorized();
            }

            var agentId = Guid.Parse(agentIdValue);

            var command = new UpdateGroupCommand(id, agentId, request);
            var result = await _mediator.Send(command, cancellationToken);
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
    }
}
