using Microsoft.AspNetCore.Identity;

namespace OCSBBS.Models.Identity
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public int? UserCompanyId { get; set; }
        public UserCompany? UserCompany { get; set; }
    }
}