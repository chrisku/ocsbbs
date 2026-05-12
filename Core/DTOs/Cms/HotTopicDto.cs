namespace OCSBBS.Core.DTOs.Cms
{
    public class HotTopicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TitleTag { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public bool IsFrontPage { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class HotTopicFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string TitleTag { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public bool IsFrontPage { get; set; }
        public bool IsPublished { get; set; }
    }

    public class CreateHotTopicDto : HotTopicFormDto { }
    public class UpdateHotTopicDto : HotTopicFormDto { }

}