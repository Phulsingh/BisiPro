using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.Authentication
{
    public class RegisterResponse
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
