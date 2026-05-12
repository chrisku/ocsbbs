using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OCSBBS.Core.DTOs.Identity;
using OCSBBS.Core.Enums;
using OCSBBS.Core.Interfaces.Identity;
using OCSBBS.Models.Identity;

namespace OCSBBS.Data.Services.Identity
{

    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _db;

        public UserService(UserManager<ApplicationUser> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }


    private static UserDto MapToDto(ApplicationUser user, UserCompany? userCompany, IList<string> roles)
            {
                return new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserCompanyId = user.UserCompanyId,
                    UserCompanyName = userCompany?.Name,
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt,
                    Roles = roles.ToList()
                };
            }

        public async Task<PagedResult<UserDto>> GetUsersAsync(
            int page, int pageSize, string? search = null, UserFilter filter = UserFilter.All)
        {
            // Build a base query: users joined to their role names
            var baseQuery =
                from user in _db.Users
                join uc in _db.UserCompanies on user.UserCompanyId equals uc.Id into ucJoin
                from uc in ucJoin.DefaultIfEmpty()
                select new
                {
                    user,
                    uc,
                    roleNames = (
                        from ur in _db.UserRoles
                        join r in _db.Roles on ur.RoleId equals r.Id
                        where ur.UserId == user.Id
                        select r.Name
                    ).ToList()
                };

            // Search
            if (!string.IsNullOrEmpty(search))
            {
                baseQuery = baseQuery.Where(x =>
                    x.user.UserName!.Contains(search) ||
                    x.user.Email!.Contains(search) ||
                    x.user.FirstName.Contains(search) ||
                    x.user.LastName.Contains(search) ||
                    x.user.CompanyName.Contains(search));
            }

            // Filter using subquery existence checks instead of a projected collection
            IQueryable<ApplicationUser> filteredUsers = filter switch
            {
                UserFilter.Active => _db.Users.Where(u =>
                    !_db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "INACTIVE"))),

                UserFilter.Inactive => _db.Users.Where(u =>
                    _db.UserRoles.Any(ur =>
                    ur.UserId == u.Id &&
                    _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "INACTIVE"))),

                UserFilter.Employees => _db.Users.Where(u =>
                    _db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId &&
                            (r.NormalizedName == "EMPLOYEE" || r.NormalizedName == "ADMIN")))),

                UserFilter.LawFirm => _db.Users.Where(u =>
                    _db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "LAWFIRM")) &&
                    !_db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "INACTIVE"))),

                UserFilter.FinancialAssurance => _db.Users.Where(u =>
                    _db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "FA")) &&
                    !_db.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _db.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "INACTIVE"))),

                _ => _db.Users
            };

            // Apply filter as a restriction on the base query
            baseQuery = baseQuery.Where(x => filteredUsers.Select(u => u.Id).Contains(x.user.Id));

            var totalCount = await baseQuery.CountAsync();

            var rows = await baseQuery
                .OrderBy(x => x.user.LastName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = rows.Select(x => MapToDto(x.user, x.uc, x.roleNames)).ToList();

            return new PagedResult<UserDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }


        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userManager.Users
                .Include(u => u.UserCompany)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserCompanyId = dto.UserCompanyId,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

            if (dto.Roles.Any())
                await _userManager.AddToRolesAsync(user, dto.Roles);

            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            var user = await _userManager.Users
                .Include(u => u.UserCompany)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) throw new Exception("User not found");

            user.Email = dto.Email;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.UserCompanyId = dto.UserCompanyId;

            await _userManager.UpdateAsync(user);

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (dto.Roles.Any())
                await _userManager.AddToRolesAsync(user, dto.Roles);

            var roles = await _userManager.GetRolesAsync(user);
            return MapToDto(user, roles);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) throw new Exception("User not found");

            await _userManager.DeleteAsync(user);
        }

        public async Task<List<string>> GetUserRolesAsync(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task UpdateUserRolesAsync(int id, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) throw new Exception("User not found");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (roles.Any())
                await _userManager.AddToRolesAsync(user, roles);
        }

        private static UserDto MapToDto(ApplicationUser user, IList<string> roles)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserCompanyId = user.UserCompanyId,
                UserCompanyName = user.UserCompany?.Name,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                Roles = roles.ToList()
            };
        }
    }
}