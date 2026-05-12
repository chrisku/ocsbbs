using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Cms
{
    [Route("api/[controller]")]
    public class AreasController : CmsControllerBase<AreaDto, CreateAreaDto, UpdateAreaDto, IAreaService>
    {
        public AreasController(IAreaService service) : base(service) { }
    }
}