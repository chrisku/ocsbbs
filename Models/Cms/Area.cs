using Models;

namespace OCSBBS.Models.Cms
{
    public class Area : BaseEntity
    {
        public required string AreaAbbreviation { get; set; }
        public required string AreaName { get; set; }
    }
}