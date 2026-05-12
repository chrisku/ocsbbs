using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Reports;
using OCSBBS.Core.Interfaces;
using OCSBBS.Core.Interfaces.Reports;

namespace OCSBBS.Api.Controllers.Reports
{
    [Route("api/[controller]")]
    public class CompanyOfficersController : ReportsControllerBase<CompanyOfficerDto, ICompanyOfficerService>
    {
        public CompanyOfficersController(ICompanyOfficerService service) : base(service) { }
    }
}