using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;

namespace BisiPro.Application.Features.Authentications.Commands.ExternalLogin
{
    public class ExternalLoginCommand : IRequest<ApiResponse<LoginResponse>>
    {
        public string Provider { get; set; } = string.Empty;

        public string ProviderKey { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public ExternalLoginCommand(
            string provider,
            string providerKey,
            string email,
            string firstName,
            string lastName)
        {
            Provider = provider;
            ProviderKey = providerKey;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
           
        }
    }
}