using BisiPro.Domain.Entities;
using BisiPro.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace BisiPro.Infrastructure.Seeder
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await context.Database.MigrateAsync();

            if (!await context.Roles.AnyAsync())
            {
                var roles = new List<Role>
                {
                    new Role
                    {
                        Name = "Admin",
                        Description = "System Administrator",
                        IsActive = true
                    },

                    new Role
                    {
                        Name = "Agent",
                        Description = "Bisi Agent",
                        IsActive = true
                    },

                    new Role
                    {
                        Name = "Users",
                        Description = "Users uses the Application",
                        IsActive = true
                    }
                };

                await context.Roles.AddRangeAsync(roles);

                await context.SaveChangesAsync();
            }
        }
    }
}
