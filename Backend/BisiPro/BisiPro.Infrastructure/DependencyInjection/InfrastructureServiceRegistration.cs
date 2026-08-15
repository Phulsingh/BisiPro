using BisiPro.Application.Interfaces;
using BisiPro.Application.Interfaces.Repositories;
using BisiPro.Infrastructure.Authentication;
using BisiPro.Infrastructure.Persistence;
using BisiPro.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BisiPro.Infrastructure.DependencyInjection
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
                 IConfiguration configuration
             )
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"));
            });



            // Authentication Services
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IPasswordService, PasswordHasherService>();

            //User Services
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();

            //Group Services
            services.AddScoped<IGroupRepository, GroupRepository>();

            //GroupMember Services
            services.AddScoped<IGroupMemberRepository,GroupMemberRepository>();

            return services;
        }
    }
}
