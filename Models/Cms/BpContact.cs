using Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OCSBBS.Models.Cms
{
    public class BpContact : BaseEntity
    {
        public required string FirstName { set; get; }
        public string? MiddleName { set; get; }
        public required string LastName { set; get; }
        public string? Department { get; set; }
        public string? Title { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? CoPhone { get; set; }
        public string? CoFax { get; set; }
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }
        public string? Photo { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public int BpCompanyId { get; set; }
        [ForeignKey("BpCompanyId")]
        public BpCompany BpCompany { get; set; }
    }
}