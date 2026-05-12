using Models;

namespace OCSBBS.Models.Identity
{
    public class UserCompany : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
}