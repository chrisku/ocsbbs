using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OCSBBS.Core.Interfaces.Cms;

namespace OCSBBS.Api.Controllers.Base
{
    [ApiController]
    public abstract class CmsControllerBase<TDto, TCreateDto, TUpdateDto, TService> : ControllerBase
        where TDto : class
        where TCreateDto : class
        where TUpdateDto : class
        where TService : ICmsService<TDto, TCreateDto, TUpdateDto>
    {
        protected readonly TService _service;

        protected CmsControllerBase(TService service)
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

        [HttpPost]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Create([FromBody] TCreateDto dto)
        {
            try
            {
                var item = await _service.CreateAsync(dto);
                return Ok(item);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest(new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Update(int id, [FromBody] TUpdateDto dto)
        {
            try
            {
                var item = await _service.UpdateAsync(id, dto);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}