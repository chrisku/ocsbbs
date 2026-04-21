using Microsoft.AspNetCore.Identity;

namespace OCSBBS.Core.Entities
{
    public class ApplicationRole : IdentityRole<int>
    {
        public string? Description { get; set; }
    }
}