using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Cms
{
    [Route("api/[controller]")]
    public class AdsController : CmsControllerBase<AdDto, CreateAdDto, UpdateAdDto, IAdService>
    {
        public AdsController(IAdService service) : base(service) { }
    }
}