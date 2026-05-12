using Models;
using System.ComponentModel.DataAnnotations;

namespace OCSBBS.Models.Cms
{
    public class Client : BaseEntity
    {
        [DataType(DataType.Url)]
        public string? Website { get; set; }
        public required string BusinessName { get; set; }
        public string? Logo { get; set; }
        public string? AltTag { get; set; }
        public int ClientOrder { get; set; }
        public string? Comments { get; set; }
    }
}
