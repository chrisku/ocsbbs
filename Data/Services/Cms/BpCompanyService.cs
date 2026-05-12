using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using OCSBBS.Models.Cms;

namespace OCSBBS.Data.Services.Cms
{
    public class BpCompanyService : IBpCompanyService
    {
        private readonly AppDbContext _context;

        public BpCompanyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<BpCompanyDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.BpCompanies.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c =>
                    c.Name.Contains(search) ||
                    (c.City != null && c.City.Contains(search)) ||
                    (c.State != null && c.State.Contains(search)));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => MapToDto(c))
                .ToListAsync();

            return new PagedResult<BpCompanyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<BpCompanyDto?> GetByIdAsync(int id)
        {
            var company = await _context.BpCompanies.FindAsync(id);
            return company is null ? null : MapToDto(company);
        }

        public async Task<BpCompanyDto> CreateAsync(CreateBpCompanyDto dto)
        {
            var company = new BpCompany
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Fax = dto.Fax,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                Zip = dto.Zip
            };

            _context.BpCompanies.Add(company);
            await _context.SaveChangesAsync();

            return MapToDto(company);
        }

        public async Task<BpCompanyDto> UpdateAsync(int id, UpdateBpCompanyDto dto)
        {
            var company = await _context.BpCompanies.FindAsync(id)
                ?? throw new KeyNotFoundException($"BP Company with ID {id} was not found.");

            company.Name = dto.Name;
            company.Phone = dto.Phone;
            company.Fax = dto.Fax;
            company.Address = dto.Address;
            company.City = dto.City;
            company.State = dto.State;
            company.Zip = dto.Zip;

            await _context.SaveChangesAsync();

            return MapToDto(company);
        }

        public async Task DeleteAsync(int id)
        {
            var company = await _context.BpCompanies.FindAsync(id)
                ?? throw new KeyNotFoundException($"BP Company with ID {id} was not found.");

            _context.BpCompanies.Remove(company);
            await _context.SaveChangesAsync();
        }

        private static BpCompanyDto MapToDto(BpCompany c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            Phone = c.Phone,
            Fax = c.Fax,
            Address = c.Address,
            City = c.City,
            State = c.State,
            Zip = c.Zip
        };
    }
}
