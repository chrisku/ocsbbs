using Microsoft.AspNetCore.Identity;

namespace OCSBBS.Models.Identity
{
    public class ApplicationRole : IdentityRole<int>
    {
        public string? Description { get; set; }
    }
}