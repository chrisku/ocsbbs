using Models;
using System.ComponentModel.DataAnnotations;
namespace OCSBBS.Models.Cms
{
    public class BpCompany : BaseEntity
    {
        public required string Name { get; set; }
        [DataType(DataType.PhoneNumber)]
        public string? Phone { get; set; }
        [DataType(DataType.PhoneNumber)]
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
    }
}