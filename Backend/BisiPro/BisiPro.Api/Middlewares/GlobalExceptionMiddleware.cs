using BisiPro.Contracts.Common;
using System.Text.Json;
using FluentValidation;

namespace BisiPro.Api.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

       public GlobalExceptionMiddleware(
       RequestDelegate next,
       ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                context.Response.StatusCode =
                    StatusCodes.Status400BadRequest;

                context.Response.ContentType = "application/json";

                var response = new ApiResponse<object>
                {
                    IsSuccess = false,
                    Errors = ex.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList()
                };

                await context.Response.WriteAsJsonAsync(response);
            }
            catch (Exception exception)
            {
                _logger.LogError($"Something went wrong: {exception}");
                await HandleExceptionAsync(context, exception);
            }
        }

           private static async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
           {
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = exception switch
            {
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                ArgumentException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            var response = new ErrorResponse
            {
                Error = exception.Message,
                Errors = new List<string>()
            };

            var jsonResponse = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(jsonResponse);
        }
    }
    
}