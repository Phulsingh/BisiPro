using BisiPro.Contracts.DTO_s.Groups;
using BisiPro.Domain.Entities;

namespace BisiPro.Application.Mappings
{
    public static class GroupMapping
    {
        public static GroupResponse ToResponse(
        this Group group)
        {
            return new GroupResponse
            {
                GroupId = group.Id,
                GroupName = group.GroupName,
                Description = group.Description,
                BisiType = group.BisiType,
                MonthlyAmount = group.MonthlyAmount,
                TotalMembers = group.TotalMembers,
                DurationInMonths = group.DurationInMonths,
                StartDate = group.StartDate,
                EndDate = group.EndDate,
                CollectionDay = group.CollectionDay,
                AuctionDay = group.AuctionDay,
                LateFee = group.LateFee,
                GracePeriod = group.GracePeriod,
                IsActive = group.IsActive,
            };
        }

        public static Group ToEntity(
          this CreateGroupRequest request,
         Guid agentId)
        {
            return new Group
            {
                GroupName = request.GroupName,
                Description = request.Description,
                BisiType = request.BisiType,
                MonthlyAmount = request.MonthlyAmount,
                TotalMembers = request.TotalMembers,
                DurationInMonths = request.DurationInMonths,
                StartDate = request.StartDate,
                CollectionDay = request.CollectionDay,
                AuctionDay = request.AuctionDay,
                LateFee = request.LateFee,
                GracePeriod = request.GracePeriod,
                AgentId = agentId,
                IsActive = true
            };
        }
    }
}
