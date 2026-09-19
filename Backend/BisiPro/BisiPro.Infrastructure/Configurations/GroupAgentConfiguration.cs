using BisiPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BisiPro.Infrastructure.Persistence.Configurations
{
    public class GroupAgentConfiguration
        : IEntityTypeConfiguration<GroupAgent>
    {
        public void Configure(
            EntityTypeBuilder<GroupAgent> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Group)
                .WithMany(x => x.GroupAgents)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Agent)
                .WithMany(x => x.AssignedGroups)
                .HasForeignKey(x => x.AgentId)
                .OnDelete(DeleteBehavior.Restrict);

            // One agent cannot be assigned
            // to the same group twice.
            builder.HasIndex(x => new
            {
                x.GroupId,
                x.AgentId
            })
            .IsUnique();
        }
    }
}