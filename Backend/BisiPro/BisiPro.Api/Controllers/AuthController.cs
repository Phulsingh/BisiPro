using BisiPro.Application.Features.Authentications.Commands.Login;
using BisiPro.Application.Features.Authentications.Commands.Register;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BisiPro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // -------------------------------
        // Register
        // -------------------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request
            )
        {
            var command = new RegisterCommand(request);
            var result = await _mediator.Send(command);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        // -------------------------------
        // Login
        // -------------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request
            )
        {
            var command = new LoginCommand(request);
            var result = await _mediator.Send(command);

            if (!result.IsSuccess)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }


        [HttpPost("claim-check")]
        public async Task<IActionResult> CheckClaim([FromBody] CreateGroupRequest request)
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated,
                AuthenticationType = User.Identity?.AuthenticationType,
                Claims = User.Claims.Select(c => new
                {
                    c.Type,
                    c.Value
                })
            });
        }
    }
}
