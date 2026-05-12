namespace OCSBBS.Core.DTOs.Cms
{
    public class BpCompanyDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
    }

    public class BpCompanyFormDto
    {
        public required string Name { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
    }

    public class CreateBpCompanyDto : BpCompanyFormDto { }
    public class UpdateBpCompanyDto : BpCompanyFormDto { }
}
