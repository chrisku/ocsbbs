using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.DTOs;

namespace OCSBBS.Core.Interfaces.Cms
{
    public interface IHotTopicService : ICmsService<HotTopicDto, CreateHotTopicDto, UpdateHotTopicDto>
    {
        Task<HotTopicDto?> GetByUrlAsync(string url);
        Task<List<HotTopicDto>> GetFrontPageAsync();
        Task<PagedResult<HotTopicDto?>> GetPublishedAsync(int page, int pageSize);
    }
}