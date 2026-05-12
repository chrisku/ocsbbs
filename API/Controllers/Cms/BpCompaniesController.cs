using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Cms
{
    [Route("api/[controller]")]
    public class BpCompaniesController : CmsControllerBase<BpCompanyDto, CreateBpCompanyDto, UpdateBpCompanyDto, IBpCompanyService>
    {
        public BpCompaniesController(IBpCompanyService service) : base(service) { }
    }
}
