using BisiPro.Application.Behaviors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace BisiPro.Application.DependencyInjection
{
     public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services)
        {
            // Register MediatR
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            });

            // Register FluentValidation Validators
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // Register Validation Pipeline
            services.AddTransient(
                typeof(IPipelineBehavior<,>),
                typeof(ValidationBehavior<,>));

            return services;
        }
    }
}
