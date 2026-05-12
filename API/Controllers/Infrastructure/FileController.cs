using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileController : ControllerBase
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    private static readonly HashSet<string> AllowedSubfolders =
    [
        "ads",
        "bp-contacts",
        "clients",
    ];

    private readonly IWebHostEnvironment _env;

    public FileController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string? subfolder = null)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest("Only jpg, jpeg, png, gif, and webp files are allowed.");

        if (subfolder != null && !AllowedSubfolders.Contains(subfolder))
            return BadRequest($"Invalid subfolder. Allowed values: {string.Join(", ", AllowedSubfolders)}.");

        var resolvedSubfolder = subfolder ?? "general";
        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", resolvedSubfolder);
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{resolvedSubfolder}/{fileName}";
        return Ok(new { url });
    }
}