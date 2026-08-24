using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.ForgotPassword.Commands
{
    public class ForgotPasswordCommand
        : IRequest<ApiResponse<string>>
    {
        public ForgotPasswordRequest Request { get; }
        public ForgotPasswordCommand(
            ForgotPasswordRequest request)
        {
            Request = request;
        }
    }
}
