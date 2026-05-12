using OCSBBS.Core.DTOs;

namespace OCSBBS.Core.Interfaces.Cms
{
    public interface ICmsService<TDto, TCreateDto, TUpdateDto>
    {
        Task<PagedResult<TDto>> GetAllAsync(int page, int pageSize, string? search = null);
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TCreateDto dto);
        Task<TDto> UpdateAsync(int id, TUpdateDto dto);
        Task DeleteAsync(int id);
    }
}