using OCSBBS.Core.DTOs;

namespace OCSBBS.Core.Interfaces
{
    public interface IReportsService<TDto>
    {
        Task<PagedResult<TDto>> GetAllAsync(int page, int pageSize, string? search = null);
        Task<TDto?> GetByIdAsync(int id);
    }
}