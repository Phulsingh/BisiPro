using BisiPro.Contracts.DTO_s.Groups;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Contracts.DTO_s.Users
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty; 
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public List<GroupDropdownResponse> Groups { get; set; } = new();
    }
}
