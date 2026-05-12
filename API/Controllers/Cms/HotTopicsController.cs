using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Cms
{
    [Route("api/[controller]")]
    public class HotTopicsController : CmsControllerBase<HotTopicDto, CreateHotTopicDto, UpdateHotTopicDto, IHotTopicService>
    {
        public HotTopicsController(IHotTopicService service) : base(service) { }

        [HttpGet("published/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublishedById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null || !item.IsPublished) return NotFound();
            return Ok(item);
        }
    }
}