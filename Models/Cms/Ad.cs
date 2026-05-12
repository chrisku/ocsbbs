using Models;
using System.ComponentModel.DataAnnotations;

namespace OCSBBS.Models.Cms
{
    public class Ad : BaseEntity
    {
        public required string Name { get; set; }
        public required string Image { get; set; }
        [DataType(DataType.Url)]
        public required string Url { get; set; }
        public int Weight { get; set; }
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
        public string? AltTag { get; set; }
        public required string Category { get; set; }
        public int Clicks { get; set; }
        public int PageViews { get; set; }
    }
}
