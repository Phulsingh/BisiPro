using BisiPro.Application.Features.Dashboard.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BisiPro.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(IMediator mediator, ILogger<AdminDashboardController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAdminDashboard(CancellationToken cancellationToken)
        {
            _logger.LogInformation(
               "Admin dashboard request received.");

            var query = new GetAdminDashboardQuery();

            var result = await _mediator.Send(
               query,
               cancellationToken);

            return Ok(result);
        }
    }
}
