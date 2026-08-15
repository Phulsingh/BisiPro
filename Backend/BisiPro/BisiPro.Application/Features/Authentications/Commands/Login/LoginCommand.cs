using BisiPro.Contracts.Authentication;
using BisiPro.Contracts.Common;
using MediatR;


namespace BisiPro.Application.Features.Authentications.Commands.Login
{
    public class LoginCommand : IRequest<ApiResponse<LoginResponse>>
    {
        public LoginRequest Request { get; }
        public LoginCommand(LoginRequest request)
        {
            Request = request;
        }
    }
}
