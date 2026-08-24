using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.ForgotPassword
{
    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
