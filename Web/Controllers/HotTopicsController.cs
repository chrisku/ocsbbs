using Microsoft.AspNetCore.Mvc;
using OCSBBS.Core.Interfaces;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Web.Controllers
{
    public class HotTopicsController : Controller
    {
        private readonly IHotTopicService _hotTopicService;

        public HotTopicsController(IHotTopicService hotTopicService)
        {
            _hotTopicService = hotTopicService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Hot Topics";
            var result = await _hotTopicService.GetPublishedAsync(1, 25);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var topic = await _hotTopicService.GetByIdAsync(id);
            if (topic == null) return NotFound();
            if (!topic.IsPublished) return NotFound();

            ViewData["Title"] = topic.TitleTag.Length > 0 ? topic.TitleTag : topic.Title;
            ViewData["MetaDescription"] = topic.MetaDescription;
            return View(topic);
        }
    }
}