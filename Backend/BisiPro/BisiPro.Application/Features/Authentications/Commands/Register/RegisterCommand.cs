using BisiPro.Contracts.Common;
using BisiPro.Contracts.Authentication;
using MediatR;


namespace BisiPro.Application.Features.Authentications.Commands.Register
{
    public class RegisterCommand : IRequest<ApiResponse<RegisterResponse>>
    {
        public RegisterRequest Request { get; }
        public RegisterCommand(RegisterRequest request)
        {
           Request = request;
        }
    }
}
