using Microsoft.AspNetCore.Mvc;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Reports;
using OCSBBS.Core.Interfaces.Reports;

namespace OCSBBS.Api.Controllers.Reports
{
    [Route("api/[controller]")]
    public class CompanyQualificationsController : ReportsControllerBase<CompanyQualificationDto, ICompanyQualificationService>
    {
        public CompanyQualificationsController(ICompanyQualificationService service) : base(service) { }
    }
}