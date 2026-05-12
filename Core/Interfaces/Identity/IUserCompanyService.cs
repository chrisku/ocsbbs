using OCSBBS.Core.DTOs.Identity;

namespace OCSBBS.Core.Interfaces.Identity
{
    public interface IUserCompanyService
    {
        Task<PagedResult<UserCompanyDto>> GetAllAsync(int page, int pageSize, string? search = null);
        Task<UserCompanyDto?> GetByIdAsync(int id);
        Task<UserCompanyDto> CreateAsync(string name);
        Task<UserCompanyDto> UpdateAsync(int id, string name);
        Task DeleteAsync(int id);
    }
}