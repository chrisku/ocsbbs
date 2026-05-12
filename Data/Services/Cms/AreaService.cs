using OCSBBS.Models.Cms;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using Microsoft.EntityFrameworkCore;

namespace OCSBBS.Data.Services
{
    public class AreaService : IAreaService
    {
        private readonly AppDbContext _context;

        public AreaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<AreaDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.Areas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    a.AreaName.Contains(search) ||
                    a.AreaAbbreviation.Contains(search));   
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(a => a.AreaName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => MapToDto(a))
                .ToListAsync();

            return new PagedResult<AreaDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<AreaDto?> GetByIdAsync(int id)
        {
            var area = await _context.Areas.FindAsync(id);
            return area is null ? null : MapToDto(area);
        }

        public async Task<AreaDto> CreateAsync(CreateAreaDto dto)
        {
            var area = new Area
            {
                AreaName = dto.AreaName,
                AreaAbbreviation = dto.AreaAbbreviation
            };

            _context.Areas.Add(area);
            await _context.SaveChangesAsync();

            return MapToDto(area);
        }

        public async Task<AreaDto> UpdateAsync(int id, UpdateAreaDto dto)
        {
            var area = await _context.Areas.FindAsync(id)
                ?? throw new KeyNotFoundException($"Area with ID {id} was not found.");

            area.AreaName = dto.AreaName;
            area.AreaAbbreviation = dto.AreaAbbreviation;
            
            await _context.SaveChangesAsync();

            return MapToDto(area);
        }

        public async Task DeleteAsync(int id)
        {
            var area = await _context.Areas.FindAsync(id)
                ?? throw new KeyNotFoundException($"Area with ID {id} was not found.");

            _context.Areas.Remove(area);
            await _context.SaveChangesAsync();
        }

        private static AreaDto MapToDto(Area area) => new()
        {
            Id = area.Id,
            AreaName = area.AreaName,
            AreaAbbreviation = area.AreaAbbreviation
        };
    }
}