using BisiPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BisiPro.Infrastructure.Persistence.Configurations
{
    public class ExternalLoginConfiguration : IEntityTypeConfiguration<ExternalLogin>
    {
        public void Configure(EntityTypeBuilder<ExternalLogin> builder)
        {
            builder.ToTable("ExternalLogins");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Provider)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.ProviderKey)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(x => new
            {
                x.Provider,
                x.ProviderKey
            })
            .IsUnique();

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}