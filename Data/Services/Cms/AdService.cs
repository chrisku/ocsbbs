using OCSBBS.Models.Cms;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using Microsoft.EntityFrameworkCore;

namespace OCSBBS.Data.Services
{
    public class AdService : IAdService
    {
        private readonly AppDbContext _context;

        public AdService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<AdDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.Ads.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    a.Name.Contains(search) ||
                    a.Category.Contains(search) ||
                    a.Url.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(a => a.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => MapToDto(a))
                .ToListAsync();

            return new PagedResult<AdDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<AdDto?> GetByIdAsync(int id)
        {
            var ad = await _context.Ads.FindAsync(id);
            return ad is null ? null : MapToDto(ad);
        }

        public async Task<AdDto> CreateAsync(CreateAdDto dto)
        {
            var ad = new Ad
            {
                Name = dto.Name,
                Image = dto.Image,
                Url = dto.Url,
                Weight = dto.Weight,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                AltTag = dto.AltTag,
                Category = dto.Category
            };

            _context.Ads.Add(ad);
            await _context.SaveChangesAsync();

            return MapToDto(ad);
        }

        public async Task<AdDto> UpdateAsync(int id, UpdateAdDto dto)
        {
            var ad = await _context.Ads.FindAsync(id)
                ?? throw new KeyNotFoundException($"Ad with ID {id} was not found.");

            ad.Name = dto.Name;
            ad.Image = dto.Image;
            ad.Url = dto.Url;
            ad.Weight = dto.Weight;
            ad.StartDate = dto.StartDate;
            ad.EndDate = dto.EndDate;
            ad.AltTag = dto.AltTag;
            ad.Category = dto.Category;

            await _context.SaveChangesAsync();

            return MapToDto(ad);
        }

        public async Task DeleteAsync(int id)
        {
            var ad = await _context.Ads.FindAsync(id)
                ?? throw new KeyNotFoundException($"Ad with ID {id} was not found.");

            _context.Ads.Remove(ad);
            await _context.SaveChangesAsync();
        }

        private static AdDto MapToDto(Ad ad) => new()
        {
            Id = ad.Id,
            Name = ad.Name,
            Image = ad.Image,
            Url = ad.Url,
            Weight = ad.Weight,
            StartDate = ad.StartDate,
            EndDate = ad.EndDate,
            AltTag = ad.AltTag,
            Category = ad.Category,
            Clicks = ad.Clicks,
            PageViews = ad.PageViews
        };
    }
}