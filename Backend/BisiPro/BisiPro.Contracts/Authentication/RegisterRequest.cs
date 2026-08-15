using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.Authentication
{
    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Guid? RoleId { get; set; } //optiona
    }
}
