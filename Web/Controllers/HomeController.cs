using Microsoft.AspNetCore.Mvc;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHotTopicService _hotTopicService;

        public HomeController(IHotTopicService hotTopicService)
        {
            _hotTopicService = hotTopicService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Home";
            var hotTopics = await _hotTopicService.GetFrontPageAsync();
            return View(hotTopics);
        }
    }
}