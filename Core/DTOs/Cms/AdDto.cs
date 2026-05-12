namespace OCSBBS.Core.DTOs.Cms
{
    public class AdDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Image { get; set; }
        public required string Url { get; set; }
        public int Weight { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? AltTag { get; set; }
        public required string Category { get; set; }
        public int Clicks { get; set; }
        public int PageViews { get; set; }
    }

    public class AdFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int Weight { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? AltTag { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class CreateAdDto : AdFormDto { }
    public class UpdateAdDto : AdFormDto { }

}