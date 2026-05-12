using OCSBBS.Core.DTOs.Identity;
using OCSBBS.Core.Enums;

namespace OCSBBS.Core.Interfaces.Identity
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search = null, UserFilter filter = UserFilter.All);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto dto);
        Task<UserDto> UpdateUserAsync(int id, UpdateUserDto dto);
        Task DeleteUserAsync(int id);
        Task<List<string>> GetUserRolesAsync(int id);
        Task UpdateUserRolesAsync(int id, List<string> roles);
    }
}