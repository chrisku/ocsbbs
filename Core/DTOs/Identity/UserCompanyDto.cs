using OCSBBS.Core.DTOs.Identity;

public class UserCompanyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int UserCount { get; set; }
    public List<UserDto> Users { get; set; } = new();
}