using BisiPro.Application.Features.AI.Gemini;
using BisiPro.Contracts.AI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BisiPro.Api.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AIController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat(
            [FromBody] ChatRequest request,
            CancellationToken cancellationToken)
        {
            var command = new ChatCommand(
                request.Message);

            var result = await _mediator.Send(
                command,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}