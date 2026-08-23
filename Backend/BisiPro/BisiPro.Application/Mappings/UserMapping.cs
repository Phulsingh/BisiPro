using BisiPro.Contracts.DTO_s.Users;
using BisiPro.Domain.Entities;
using BisiPro.Contracts.DTO_s.Groups;

namespace BisiPro.Application.Mappings
{
    public static class UserMapping
    {
        public static UserResponse ToResponse(this User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,  
                LastName = user.LastName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth.ToString("yyyy-MM-dd"),
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,

                Groups = user.GroupMemberships
                         .Where(x => x.IsActive)
                         .Select( x=> new GroupDropdownResponse
                         {
                           Id = x.Group.Id,
                           GroupName = x.Group.GroupName
                         }).ToList()

            };
        }
    }
}
