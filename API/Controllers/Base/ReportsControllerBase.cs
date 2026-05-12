using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OCSBBS.Core.Interfaces;

namespace OCSBBS.Api.Controllers.Base
{
    [ApiController]
    [Authorize(Roles = "Admin,Employee,OCSBBS")]
    public abstract class ReportsControllerBase<TDto, TService> : ControllerBase
        where TDto : class
        where TService : IReportsService<TDto>
    {
        protected readonly TService _service;

        protected ReportsControllerBase(TService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 25,
            [FromQuery] string? search = null)
        {
            var result = await _service.GetAllAsync(page, pageSize, search);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}