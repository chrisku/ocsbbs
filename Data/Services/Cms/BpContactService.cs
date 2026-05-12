using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;
using OCSBBS.Models.Cms;

namespace OCSBBS.Data.Services.Cms
{
    public class BpContactService : IBpContactService
    {
        private readonly AppDbContext _context;

        public BpContactService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<BpContactDto>> GetAllAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.BpContacts.Include(c => c.BpCompany).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c =>
                    c.FirstName.Contains(search) ||
                    c.LastName.Contains(search) ||
                    c.Email.Contains(search) ||
                    (c.Department != null && c.Department.Contains(search)) ||
                    c.BpCompany.Name.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => MapToDto(c))
                .ToListAsync();

            return new PagedResult<BpContactDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<BpContactDto?> GetByIdAsync(int id)
        {
            var contact = await _context.BpContacts
                .Include(c => c.BpCompany)
                .FirstOrDefaultAsync(c => c.Id == id);
            return contact is null ? null : MapToDto(contact);
        }

        public async Task<BpContactDto> CreateAsync(CreateBpContactDto dto)
        {
            var contact = new BpContact
            {
                FirstName   = dto.FirstName,
                MiddleName  = dto.MiddleName,
                LastName    = dto.LastName,
                Department  = dto.Department,
                Title       = dto.Title,
                Phone       = dto.Phone,
                Fax         = dto.Fax,
                CoPhone     = dto.CoPhone,
                CoFax       = dto.CoFax,
                Email       = dto.Email,
                Photo       = dto.Photo,
                Address     = dto.Address,
                City        = dto.City,
                State       = dto.State,
                Zip         = dto.Zip,
                BpCompanyId = dto.BpCompanyId,
                ModifiedAt  = DateTime.UtcNow,
            };

            _context.BpContacts.Add(contact);
            await _context.SaveChangesAsync();

            await _context.Entry(contact).Reference(c => c.BpCompany).LoadAsync();

            return MapToDto(contact);
        }

        public async Task<BpContactDto> UpdateAsync(int id, UpdateBpContactDto dto)
        {
            var contact = await _context.BpContacts
                .Include(c => c.BpCompany)
                .FirstOrDefaultAsync(c => c.Id == id)
                ?? throw new KeyNotFoundException($"BP Contact with ID {id} was not found.");

            contact.FirstName   = dto.FirstName;
            contact.MiddleName  = dto.MiddleName;
            contact.LastName    = dto.LastName;
            contact.Department  = dto.Department;
            contact.Title       = dto.Title;
            contact.Phone       = dto.Phone;
            contact.Fax         = dto.Fax;
            contact.CoPhone     = dto.CoPhone;
            contact.CoFax       = dto.CoFax;
            contact.Email       = dto.Email;
            contact.Photo       = dto.Photo;
            contact.Address     = dto.Address;
            contact.City        = dto.City;
            contact.State       = dto.State;
            contact.Zip         = dto.Zip;
            contact.BpCompanyId = dto.BpCompanyId;
            contact.ModifiedAt  = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _context.Entry(contact).Reference(c => c.BpCompany).LoadAsync();

            return MapToDto(contact);
        }

        public async Task DeleteAsync(int id)
        {
            var contact = await _context.BpContacts.FindAsync(id)
                ?? throw new KeyNotFoundException($"BP Contact with ID {id} was not found.");

            _context.BpContacts.Remove(contact);
            await _context.SaveChangesAsync();
        }

        private static BpContactDto MapToDto(BpContact c) => new()
        {
            Id            = c.Id,
            FirstName     = c.FirstName,
            MiddleName    = c.MiddleName,
            LastName      = c.LastName,
            Department    = c.Department,
            Title         = c.Title,
            Phone         = c.Phone,
            Fax           = c.Fax,
            CoPhone       = c.CoPhone,
            CoFax         = c.CoFax,
            Email         = c.Email,
            Photo         = c.Photo,
            Address       = c.Address,
            City          = c.City,
            State         = c.State,
            Zip           = c.Zip,
            ModifiedAt    = c.ModifiedAt,
            BpCompanyId   = c.BpCompanyId,
            BpCompanyName = c.BpCompany?.Name ?? string.Empty,
        };
    }
}
