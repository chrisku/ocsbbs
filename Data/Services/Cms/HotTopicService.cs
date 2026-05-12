using OCSBBS.Models.Cms;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using Microsoft.EntityFrameworkCore;

namespace OCSBBS.Data.Services
{
    public class HotTopicService : IHotTopicService
    {
        private readonly AppDbContext _context;

        public HotTopicService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<HotTopicDto>> GetFrontPageAsync()
        {
            return await _context.HotTopics
                .Where(h => h.IsPublished && h.IsFrontPage && h.PublishedDate <= DateTime.UtcNow)
                .OrderByDescending(h => h.PublishedDate)
                .Select(h => new HotTopicDto
                {
                    Id = h.Id,
                    Title = h.Title,
                    Body = h.Body,
                    Url = h.Url,
                    PublishedDate = h.PublishedDate,
                    IsFrontPage = h.IsFrontPage,
                    IsPublished = h.IsPublished
                })
                .ToListAsync();
        }

        public async Task<PagedResult<HotTopicDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.HotTopics.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h =>
                    h.Title.Contains(search) ||
                    h.Body.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(h => h.PublishedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<HotTopicDto>
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<HotTopicDto>> GetPublishedAsync(int page, int pageSize)
        {
            var query = _context.HotTopics
                .Where(h => h.IsPublished && h.PublishedDate <= DateTime.UtcNow);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(h => h.PublishedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<HotTopicDto>
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<HotTopicDto?> GetByUrlAsync(string url)
        {
            var item = await _context.HotTopics
                .FirstOrDefaultAsync(h => h.Url == url && h.IsPublished);
            return item == null ? null : MapToDto(item);
        }

        public async Task<HotTopicDto?> GetByIdAsync(int id)
        {
            var item = await _context.HotTopics.FindAsync(id);
            return item == null ? null : MapToDto(item);
        }

        public async Task<HotTopicDto> CreateAsync(CreateHotTopicDto dto)
        {
            var item = new HotTopic
            {
                Title = dto.Title,
                TitleTag = dto.TitleTag,
                MetaDescription = dto.MetaDescription,
                Url = dto.Url,
                Body = dto.Body,
                PublishedDate = dto.PublishedDate,
                IsFrontPage = dto.IsFrontPage,
                IsPublished = dto.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.HotTopics.Add(item);
            await _context.SaveChangesAsync();
            return MapToDto(item);
        }

        public async Task<HotTopicDto> UpdateAsync(int id, UpdateHotTopicDto dto)
        {
            var item = await _context.HotTopics.FindAsync(id)
                ?? throw new KeyNotFoundException($"Hot Topic with ID {id} was not found.");
            item.Title = dto.Title;
            item.TitleTag = dto.TitleTag;
            item.MetaDescription = dto.MetaDescription;
            item.Url = dto.Url;
            item.Body = dto.Body;
            item.PublishedDate = dto.PublishedDate;
            item.IsFrontPage = dto.IsFrontPage;
            item.IsPublished = dto.IsPublished;
            item.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(item);
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.HotTopics.FindAsync(id)
                ?? throw new KeyNotFoundException($"Hot Topic with ID {id} was not found.");

            _context.HotTopics.Remove(item);
            await _context.SaveChangesAsync();
        }

        private static HotTopicDto MapToDto(HotTopic item)
        {
            return new HotTopicDto
            {
                Id = item.Id,
                Title = item.Title,
                TitleTag = item.TitleTag,
                MetaDescription = item.MetaDescription,
                Url = item.Url,
                Body = item.Body,
                PublishedDate = item.PublishedDate,
                IsFrontPage = item.IsFrontPage,
                IsPublished = item.IsPublished,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            };
        }
    }
}