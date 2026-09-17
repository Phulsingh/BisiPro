using BisiPro.Application.Features.Users.Queries.GetUserById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BisiPro.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<UserController> _logger;

        public UserController(
           IMediator mediator,
           ILogger<UserController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }


        [HttpGet("{id:guid}")]
        public async  Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
        {
            _logger.LogInformation(
               "Get User request received for UserId: {UserId}",
               id);

            var result = await _mediator.Send(new GetUserByIdQuery(id), cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning(
                   "User not found for UserId: {UserId}",
                   id);

                return NotFound(result);
            }

            _logger.LogInformation(
               "User retrieved successfully for UserId: {UserId}",
               id);

            return Ok(result);
        }


        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile(
        CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirst(
                System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized();
            }

            _logger.LogInformation(
                "Get current user profile request received for UserId: {UserId}",
                userId);

            var result = await _mediator.Send(
                new GetUserByIdQuery(userId),
                cancellationToken);

            if (!result.IsSuccess)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
