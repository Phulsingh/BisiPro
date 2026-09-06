using BisiPro.Application.Features.Authentications.Commands.Login;
using BisiPro.Application.Features.Authentications.Commands.Register;
using BisiPro.Application.Features.Authentications.Commands.ExternalLogin;
using BisiPro.Application.Features.Authentications.ForgotPassword;
using BisiPro.Application.Features.Authentications.ForgotPassword.Commands;
using BisiPro.Application.Features.Authentications.ResetPassword;
using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.DTO_s.Groups;
using MediatR;
using Microsoft.AspNetCore.Authentication;  
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


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



        [AllowAnonymous]
        [HttpGet("google")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/api/auth/google-callback"
            };

            return Challenge(
                properties,
                GoogleDefaults.AuthenticationScheme);
        }

        // ============================================================
        // Google Callback
        // ============================================================

        [AllowAnonymous]
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback(
       CancellationToken cancellationToken)
        {
            // ============================================================
            // Get Google Authentication Result
            // ============================================================

            var result = await HttpContext.AuthenticateAsync(
                "ExternalCookie");

            if (!result.Succeeded || result.Principal == null)
            {
                return BadRequest(new
                {
                    IsSuccess = false,
                    Error = "Google authentication failed.",
                    Details = result.Failure?.Message
                });
            }

            var principal = result.Principal;


            // ============================================================
            // Extract Google Claims
            // ============================================================

            var providerKey =
                principal.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            var email =
                principal.FindFirstValue(
                    ClaimTypes.Email);

            var firstName =
                principal.FindFirstValue(
                    ClaimTypes.GivenName);

            var lastName =
                principal.FindFirstValue(
                    ClaimTypes.Surname);


            // ============================================================
            // Validate Google Claims
            // ============================================================

            if (string.IsNullOrWhiteSpace(providerKey))
            {
                await HttpContext.SignOutAsync("ExternalCookie");

                return BadRequest(new
                {
                    IsSuccess = false,
                    Error = "Google user ID was not provided."
                });
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                await HttpContext.SignOutAsync("ExternalCookie");

                return BadRequest(new
                {
                    IsSuccess = false,
                    Error = "Google email was not provided."
                });
            }


            // ============================================================
            // Create External Login Command
            // ============================================================

            var command = new ExternalLoginCommand(
                provider: "Google",
                providerKey: providerKey,
                email: email,
                firstName: firstName ?? string.Empty,
                lastName: lastName ?? string.Empty);


            // ============================================================
            // Send Command to Application Layer
            // ============================================================

            var response = await _mediator.Send(
                command,
                cancellationToken);


            // ============================================================
            // Clear Temporary External Authentication Cookie
            // ============================================================

            await HttpContext.SignOutAsync("ExternalCookie");


            // ============================================================
            // Return Result
            // ============================================================

            if (!response.IsSuccess)
            {
                return Unauthorized(response);
            }

            return Redirect(
            $"https://localhost:55344/auth/callback" +
            $"?token={Uri.EscapeDataString(response.Data.Token)}" +
            $"&userId={Uri.EscapeDataString(response.Data.UserId.ToString())}" +
            $"&fullName={Uri.EscapeDataString(response.Data.FullName)}" +
            $"&email={Uri.EscapeDataString(response.Data.Email)}" +
            $"&role={Uri.EscapeDataString(response.Data.Role)}");
        }
    }
}
