using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using OCSBBS.Auth.Configuration;
using OCSBBS.Auth.Services;
using OCSBBS.Models.Identity;
using OCSBBS.Infrastructure.Configuration;
using OCSBBS.Core.Interfaces.Infrastructure;

namespace OCSBBS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("app/login")]
        public async Task<IActionResult> AppLogin([FromBody] AuthLoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username)
                ?? await _userManager.FindByEmailAsync(request.Username);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid username or password" });

            // App access check
            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains("OCSBBS") && !roles.Contains("Admin") && !roles.Contains("Employee"))
                return Unauthorized(new { message = "You do not have access to this application" });

            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new AuthLoginResponse
            {
                Token = token,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CompanyName = user.UserCompany?.Name ?? string.Empty,
                Roles = roles.ToList()
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthLoginRequest request)
        {
            // Find user by username or email
            var user = await _userManager.FindByNameAsync(request.Username)
                ?? await _userManager.FindByEmailAsync(request.Username);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            // Check if user is active
            // Check if user is inactive
            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Inactive"))
                return Unauthorized(new { message = "Account is inactive" });

            // Verify password
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid username or password" });

            // Generate token
            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new AuthLoginResponse
            {
                Token = token,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CompanyName = user.CompanyName,
                Roles = roles.ToList()
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("dashboard/login")]
        public async Task<IActionResult> DashboardLogin([FromBody] AuthLoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username)
                ?? await _userManager.FindByEmailAsync(request.Username);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid username or password" });

            // Dashboard access check
            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains("Admin") && !roles.Contains("Employee"))
                return Unauthorized(new { message = "You do not have access to this application" });

            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new AuthLoginResponse
            {
                Token = token,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CompanyName = user.UserCompany?.Name ?? string.Empty,
                Roles = roles.ToList()
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] OCSBBS.Infrastructure.Configuration.ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            // Always return OK even if user not found - security best practice
            if (user == null)
                return Ok(new { message = "If that email exists you will receive a reset link shortly" });

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);
            var resetLink = $"{request.ClientBaseUrl}/reset-password?email={user.Email}&token={encodedToken}";

            await _emailService.SendPasswordResetEmailAsync(user.Email!, resetLink);

            return Ok(new { message = "If that email exists you will receive a reset link shortly" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] OCSBBS.Infrastructure.Configuration.ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid request" });

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

            if (!result.Succeeded)
                return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

            return Ok(new { message = "Password reset successfully" });
        }

    }
}