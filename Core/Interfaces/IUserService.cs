using OCSBBS.Core.DTOs;

namespace OCSBBS.Core.Interfaces
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search = null);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto dto);
        Task<UserDto> UpdateUserAsync(int id, UpdateUserDto dto);
        Task DeleteUserAsync(int id);
        Task<List<string>> GetUserRolesAsync(int id);
        Task UpdateUserRolesAsync(int id, List<string> roles);
    }
}