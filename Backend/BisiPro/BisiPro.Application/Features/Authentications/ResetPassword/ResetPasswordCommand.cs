using BisiPro.Application.Features.Authentications.ForgotPassword;
using BisiPro.Contracts.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.ResetPassword
{
    public class ResetPasswordCommand
        : IRequest<ApiResponse<string>>
    {
        public ResetPasswordRequest Request { get; }

        public ResetPasswordCommand(
            ResetPasswordRequest request)
        {
            Request = request;
        }
    }
}
