namespace OCSBBS.Core.DTOs.Reports
{
    public class CompanyQualificationDto
    {
        public int Id { get; set; }
        public int Code { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Bond { get; set; }
        public bool RowBond { get; set; }
        public string? Incorporation { get; set; }
        public string? Memo { get; set; }
        public string? Resolution { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string? Country { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public bool Eeo { get; set; }
        public DateTime? EeoDate { get; set; }
        public bool Debarment { get; set; }
        public DateTime? DebarmentDate { get; set; }
        public string? ForeignParent { get; set; }
        public string? BankruptcyFlag { get; set; }
        public DateTime? BankruptcyStartDate { get; set; }
        public string? BankruptcyEndDate { get; set; }
        public string? QualificationRevokedFlag { get; set; }
        public string? QualificationRevokedStartDate { get; set; }
        public string? QualificationRevokedEndDate { get; set; }
    }
}