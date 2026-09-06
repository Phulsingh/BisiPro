using BisiPro.Api.Middlewares;
using BisiPro.Application.DependencyInjection;
using BisiPro.Infrastructure.Authentication;
using BisiPro.Infrastructure.DependencyInjection;
using BisiPro.Infrastructure.Persistence;
using BisiPro.Infrastructure.Seeder;

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("https://localhost:55344")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ============================================================
// Controllers
// ============================================================

builder.Services.AddControllers();


// ============================================================
// Application Layer
// ============================================================

builder.Services.AddApplication();


// ============================================================
// Infrastructure Layer
// ============================================================

builder.Services.AddInfrastructure(builder.Configuration);


// ============================================================
// JWT Settings
// ============================================================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));


// ============================================================
// Authentication
// ============================================================
//
// BisiPro uses two authentication mechanisms:
//
// 1. JWT
//    Used for normal BisiPro API authentication.
//
// 2. Google OAuth
//    Used only when a user signs in with Google.
//
// JWT remains the default authentication scheme.
// ============================================================

builder.Services
    .AddAuthentication(options =>
    {
        // Default authentication for API requests
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        // Default challenge for API requests
        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })

    // --------------------------------------------------------
    // JWT Authentication
    // --------------------------------------------------------

    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],

            ValidAudience =
                builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:SecretKey"]!))
        };
    })

    // --------------------------------------------------------
    // External Authentication Cookie
    // --------------------------------------------------------
    //
    // This cookie is temporary.
    // It is used while Google OAuth is processing.
    //
    // It is NOT our application's JWT.
    // --------------------------------------------------------

    .AddCookie("ExternalCookie", options =>
    {
        options.Cookie.Name = "BisiPro.External";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;

        options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
        options.SlidingExpiration = false;
    })

    // --------------------------------------------------------
    // Google OAuth
    // --------------------------------------------------------

    .AddGoogle(options =>
    {
        options.ClientId =
            builder.Configuration[
                "Authentication:Google:ClientId"]!;

        options.ClientSecret =
            builder.Configuration[
                "Authentication:Google:ClientSecret"]!;

        // Google authentication will temporarily
        // use the ExternalCookie scheme.
        options.SignInScheme = "ExternalCookie";

        // Google callback endpoint
        options.CallbackPath = "/signin-google";
    });


// ============================================================
// Authorization
// ============================================================

builder.Services.AddAuthorization();


// ============================================================
// Build Application
// ============================================================

var app = builder.Build();


// ============================================================
// Database Seeder
// ============================================================

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    await DbInitializer.SeedAsync(context);
}


// ============================================================
// HTTP Request Pipeline
// ============================================================

app.UseHttpsRedirection();


// ------------------------------------------------------------
// Global Exception Middleware
// ------------------------------------------------------------

app.UseMiddleware<GlobalExceptionMiddleware>();


// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------

app.UseCors("FrontendPolicy");


// ------------------------------------------------------------
// Authentication
// ------------------------------------------------------------

app.UseAuthentication();


// ------------------------------------------------------------
// Authorization
// ------------------------------------------------------------

app.UseAuthorization();


// ------------------------------------------------------------
// Controllers
// ------------------------------------------------------------

app.MapControllers();


// ============================================================
// Run Application
// ============================================================

app.Run();