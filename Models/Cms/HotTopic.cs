using Models;
using System.ComponentModel.DataAnnotations;

namespace OCSBBS.Models.Cms
{
    public class HotTopic : BaseEntity
    {
        public required string Title { get; set; } = string.Empty;
        [MaxLength(60)]
        public string TitleTag { get; set; } = string.Empty;
        [MaxLength(160)]
        public string MetaDescription { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public bool IsFrontPage { get; set; } = false;
        public bool IsPublished { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
