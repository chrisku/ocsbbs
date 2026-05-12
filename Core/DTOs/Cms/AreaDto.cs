namespace OCSBBS.Core.DTOs.Cms
{
    public class AreaDto
    {
        public int Id { get; set; }
        public string AreaAbbreviation { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
    }

    public class AreaFormDto
    {
        public string AreaAbbreviation { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
    }

    public class CreateAreaDto : AreaFormDto { }
    public class UpdateAreaDto : AreaFormDto { }

}