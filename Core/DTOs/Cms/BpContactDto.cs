namespace OCSBBS.Core.DTOs.Cms
{
    public class BpContactDto
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public string? Department { get; set; }
        public string? Title { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? CoPhone { get; set; }
        public string? CoFax { get; set; }
        public required string Email { get; set; }
        public string? Photo { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public int BpCompanyId { get; set; }
        public string BpCompanyName { get; set; } = string.Empty;
    }

    public class BpContactFormDto
    {
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public string? Department { get; set; }
        public string? Title { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? CoPhone { get; set; }
        public string? CoFax { get; set; }
        public required string Email { get; set; }
        public string? Photo { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public int BpCompanyId { get; set; }
    }

    public class CreateBpContactDto : BpContactFormDto { }
    public class UpdateBpContactDto : BpContactFormDto { }
}
