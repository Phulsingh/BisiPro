using BisiPro.Contracts.DTO_s.GroupMembers;
using BisiPro.Domain.Entities;

namespace BisiPro.Application.Mappings
{
    public static class GroupMemberMapping
    {
        public static GroupMemberResponse ToResponse(
            this GroupMember member)
        {
            return new GroupMemberResponse
            {
                Id = member.Id,
                GroupId = member.GroupId,
                UserId = member.UserId,

                MemberName =
                    $"{member.User.FirstName} {member.User.LastName}",

                PhoneNumber = member.User.PhoneNumber,

                PayableAmount = member.PayableAmount,

                JoinedDate = member.JoinedDate,

                ExitDate = member.ExitDate,

                IsActive = member.IsActive
            };
        }
    }
}