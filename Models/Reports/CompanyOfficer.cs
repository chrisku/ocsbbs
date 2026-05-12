using Models;

namespace OCSBBS.Models.Reports
{
    public class CompanyOfficer : BaseEntity
    {
        public int Code { get; set; }
        public int? Sequence { get; set; }
        public string? Position { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? Footnote { get; set; }
        public DateTime? ModifyDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
