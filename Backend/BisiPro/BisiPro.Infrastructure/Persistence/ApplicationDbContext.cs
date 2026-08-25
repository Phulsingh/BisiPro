using BisiPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext  
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            modelBuilder.Entity<Group>(entity =>
            {
                entity.Property(x => x.MonthlyAmount)
                    .HasPrecision(18, 2);

                entity.Property(x => x.LateFee)
                    .HasPrecision(18, 2);
            });

            modelBuilder.Entity<GroupMember>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.PayableAmount)
                    .HasPrecision(18, 2);

                // Group -> GroupMembers
                entity.HasOne(x => x.Group)
                    .WithMany(x => x.Members)
                    .HasForeignKey(x => x.GroupId)
                    .OnDelete(DeleteBehavior.Restrict);

                // User -> GroupMemberships
                entity.HasOne(x => x.User)
                    .WithMany(x => x.GroupMemberships)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Restrict);


                // Prevent same user joining same group twice
                entity.HasIndex(x => new
                {
                    x.GroupId,
                    x.UserId
                })
                .IsUnique();
            });

            modelBuilder.Entity<PasswordResetToken>()
                        .HasOne(x => x.User)
                        .WithMany(x => x.PasswordResetTokens)
                        .HasForeignKey(x => x.UserId)
                        .OnDelete(DeleteBehavior.Cascade);
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
    }
}
