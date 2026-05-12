using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs.Identity;
using OCSBBS.Core.Interfaces.Identity;
using OCSBBS.Models.Identity;
using static System.Net.WebRequestMethods;

namespace OCSBBS.Data.Services.Identity
{
    public class UserCompanyService : IUserCompanyService
    {
        private readonly AppDbContext _context;

        public UserCompanyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<UserCompanyDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.UserCompanies.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new UserCompanyDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    UserCount = c.Users.Count
                })
                .ToListAsync();

            return new PagedResult<UserCompanyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<UserCompanyDto?> GetByIdAsync(int id)
        {
            var company = await _context.UserCompanies
                .Where(c => c.Id == id)
                .Select(c => new UserCompanyDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    UserCount = c.Users.Count,
                    Users = c.Users.Select(u => new UserDto
                    {
                        Id = u.Id,
                        Username = u.UserName,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        UserCompanyId = u.UserCompanyId,
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (company == null) return null;

            // Fetch roles separately via Identity's join table
            foreach (var user in company.Users)
            {
                user.Roles = await _context.UserRoles
                    .Where(ur => ur.UserId == user.Id)
                    .Join(_context.Roles,
                        ur => ur.RoleId,
                        r => r.Id,
                        (ur, r) => r.Name!)
                    .ToListAsync();
            }

            return company;
        }

        public async Task<UserCompanyDto> CreateAsync(string name)
        {
            var company = new UserCompany { Name = name };
            _context.UserCompanies.Add(company);
            await _context.SaveChangesAsync();

            return new UserCompanyDto { Id = company.Id, Name = company.Name };
        }

        public async Task<UserCompanyDto> UpdateAsync(int id, string name)
        {
            var company = await _context.UserCompanies.FindAsync(id);
            if (company == null) throw new Exception("Company not found");

            company.Name = name;
            await _context.SaveChangesAsync();

            return new UserCompanyDto { Id = company.Id, Name = company.Name };
        }

        public async Task DeleteAsync(int id)
        {
            var company = await _context.UserCompanies.FindAsync(id);
            if (company == null) throw new Exception("Company not found");

            // Check if any users are assigned to this company
            var hasUsers = await _context.Users.AnyAsync(u => u.UserCompanyId == id);
            if (hasUsers)
                throw new Exception("Cannot delete a company that has users assigned to it");

            _context.UserCompanies.Remove(company);
            await _context.SaveChangesAsync();
        }
    }
}