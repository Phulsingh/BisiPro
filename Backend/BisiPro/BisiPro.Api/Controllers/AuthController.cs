using BisiPro.Application.Features.Authentications.Commands.Login;
using BisiPro.Application.Features.Authentications.Commands.Register;
using BisiPro.Application.Features.Authentications.ForgotPassword;
using BisiPro.Application.Features.Authentications.ForgotPassword.Commands;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace BisiPro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IMediator mediator, ILogger<AuthController> logger)
        {
            _mediator = mediator;
            _logger = logger;
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

        // -------------------------------
        // Reset Password
        // -------------------------------
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest request,
        CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "Forgot password request received for Email: {Email}",
                request.Email);

            var command = new ForgotPasswordCommand(request);

            var result = await _mediator.Send(
                command,
                cancellationToken);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
         CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "Password reset request received.");

            var command = new ResetPasswordCommand(request);

            var result = await _mediator.Send(
                command,
                cancellationToken);

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
