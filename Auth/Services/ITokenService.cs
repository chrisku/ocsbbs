using OCSBBS.Models.Identity;

namespace OCSBBS.Auth.Services
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
    }
}