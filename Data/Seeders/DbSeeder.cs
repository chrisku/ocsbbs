using Microsoft.AspNetCore.Identity;
using OCSBBS.Core.Entities;

namespace OCSBBS.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            // Seed Roles
            var roles = new[]
            {
                new ApplicationRole { Name = "OCSBBS", Description = "Standard subscriber" },
                new ApplicationRole { Name = "BP", Description = "BP section access" },
                new ApplicationRole { Name = "NRF", Description = "NRF section access" },
                new ApplicationRole { Name = "LFD", Description = "LFD section access" },
                new ApplicationRole { Name = "LawFirm", Description = "Law Firm section access" },
                new ApplicationRole { Name = "FA", Description = "Financial Assurance access" },
                new ApplicationRole { Name = "Employee", Description = "Internal staff" },
                new ApplicationRole { Name = "Admin", Description = "Full admin access" },
                new ApplicationRole { Name = "Inactive", Description = "Disabled account" }
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role.Name!))
                    await roleManager.CreateAsync(role);
            }

            // Seed Admin User
            if (await userManager.FindByNameAsync("admin") == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = "admin",
                    Email = "admin@ocsbbs.com",
                    FirstName = "Admin",
                    LastName = "User",
                    CompanyName = "OCSBBS",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, "Admin@123456");

                if (result.Succeeded)
                    await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}