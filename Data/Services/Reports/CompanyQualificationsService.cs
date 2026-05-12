using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs;
using OCSBBS.Core.DTOs.Reports;
using OCSBBS.Core.Interfaces;
using OCSBBS.Core.Interfaces.Reports;

namespace OCSBBS.Data.Services
{
    public class CompanyQualificationService : ICompanyQualificationService
    {
        private readonly AppDbContext _context;

        public async Task<CompanyQualificationDto?> GetByIdAsync(int id)
        {
            var item = await _context.CompanyQualifications.FindAsync(id);
            return item == null ? null : MapToDto(item);
        }

        public CompanyQualificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<CompanyQualificationDto>> GetAllAsync(
            int page,
            int pageSize,
            string? name = null)
        {
            var query = _context.CompanyQualifications.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(c => c.Name.Contains(name));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CompanyQualificationDto>
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        private static CompanyQualificationDto MapToDto(OCSBBS.Models.Reports.CompanyQualification c)
        {
            return new CompanyQualificationDto
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                Address1 = c.Address1,
                Address2 = c.Address2,
                Address3 = c.Address3,
                City = c.City,
                State = c.State,
                Zip = c.Zip,
                Bond = c.Bond,
                RowBond = c.RowBond,
                Incorporation = c.Incorporation,
                Memo = c.Memo,
                Resolution = c.Resolution,
                ModifyDate = c.ModifyDate,
                Country = c.Country,
                ApprovalDate = c.ApprovalDate,
                Eeo = c.Eeo,
                EeoDate = c.EeoDate,
                Debarment = c.Debarment,
                DebarmentDate = c.DebarmentDate,
                ForeignParent = c.ForeignParent,
                BankruptcyFlag = c.BankruptcyFlag,
                BankruptcyStartDate = c.BankruptcyStartDate,
                BankruptcyEndDate = c.BankruptcyEndDate,
                QualificationRevokedFlag = c.QualificationRevokedFlag,
                QualificationRevokedStartDate = c.QualificationRevokedStartDate,
                QualificationRevokedEndDate = c.QualificationRevokedEndDate
            };
        }
    }
}