using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OCSBBS.Api.Controllers.Base;
using OCSBBS.Core.DTOs.Cms;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Cms
{
    [Route("api/[controller]")]
    public class ClientsController : CmsControllerBase<ClientDto, CreateClientDto, UpdateClientDto, IClientService>
    {
        public ClientsController(IClientService service) : base(service) { }

        [HttpPut("reorder")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Reorder([FromBody] List<int> orderedIds)
        {
            await _service.ReorderAsync(orderedIds);
            return NoContent();
        }
    }
}