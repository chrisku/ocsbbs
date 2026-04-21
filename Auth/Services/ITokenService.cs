using OCSBBS.Core.Entities;

namespace OCSBBS.Auth.Services
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
    }
}