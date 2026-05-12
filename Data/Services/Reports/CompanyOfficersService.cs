using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs.Reports;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.Interfaces.Reports;

namespace OCSBBS.Data.Services
{
    public class CompanyOfficerService : ICompanyOfficerService
    {
        private readonly AppDbContext _context;

        public CompanyOfficerService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<CompanyOfficerDto?> GetByIdAsync(int id)
        {
            var item = await _context.CompanyOfficers.FindAsync(id);
            return item == null ? null : MapToDto(item);
        }
        public async Task<PagedResult<CompanyOfficerDto>> GetAllAsync(
            int page,
            int pageSize,
            string? name = null)
        {
            var query = _context.CompanyOfficers.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(c => c.LastName.Contains(name));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(c => c.LastName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CompanyOfficerDto>
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        private static CompanyOfficerDto MapToDto(OCSBBS.Models.Reports.CompanyOfficer c)
        {
            return new CompanyOfficerDto
            {
                Id = c.Id,
                Code = c.Code,
                Sequence = c.Sequence,
                Position = c.Position,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Footnote=c.Footnote,
                ModifyDate=c.ModifyDate,
                ExpirationDate=c.ExpirationDate,
                CreatedDate=c.CreatedDate,
                CreatedBy=c.CreatedBy,
                UpdatedDate=c.UpdatedDate,
                UpdatedBy=c.UpdatedBy 
            };
        }
    }
}