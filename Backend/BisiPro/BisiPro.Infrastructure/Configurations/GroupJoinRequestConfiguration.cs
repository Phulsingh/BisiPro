using BisiPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BisiPro.Infrastructure.Persistence.Configurations
{
    public class GroupJoinRequestConfiguration
        : IEntityTypeConfiguration<GroupJoinRequest>
    {
        public void Configure(
            EntityTypeBuilder<GroupJoinRequest> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Status)
                .IsRequired();

            builder.Property(x => x.RejectionReason)
                .HasMaxLength(500);

            builder.HasOne(x => x.Group)
                .WithMany(x => x.JoinRequests)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany(x => x.GroupJoinRequests)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent duplicate pending/approved membership requests
            builder.HasIndex(x => new
            {
                x.GroupId,
                x.UserId
            });
        }
    }
}