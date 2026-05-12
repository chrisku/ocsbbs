using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OCSBBS.Models.Cms;
using OCSBBS.Models.Identity;
using OCSBBS.Models.Reports;

namespace OCSBBS.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // CMS
        public DbSet<Ad> Ads { get; set; }
        public DbSet<Area> Areas { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<HotTopic> HotTopics { get; set; }

        // Identity
        public DbSet<UserCompany> UserCompanies { get; set; }

        // Reports
        public DbSet<CompanyOfficer> CompanyOfficers { get; set; }
        public DbSet<CompanyQualification> CompanyQualifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename Identity tables to something cleaner
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<ApplicationRole>().ToTable("Roles");
            builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");

        }
    }
}