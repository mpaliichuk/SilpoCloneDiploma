using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Threading.Tasks;

namespace ProductServiceApi.Models
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _service;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryRepository service, ILogger<CategoryController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets all Category.
        /// </summary>

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Category>))]
        public async Task<IEnumerable<Category>> GetAllCategory()
        {
            return await _service.GetAllCategory();
        }

        /// <summary>
        /// Gets a category by ID.
        /// </summary>
        /// <param name="id">The ID of the category.</param>

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Category))]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Category>> GetCategoryByIdAsync(int id)
        {
            var category = await _service.GetCategoryById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        /// <summary>
        /// Gets a category by name.
        /// </summary>
        /// <param name="name">The name of the category.</param>
       
        [HttpGet("name/{name}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoryByName(string name)
        {
            var category = await _service.GetCategoryByName(name);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        /// <summary>
        /// Adds a new category.
        /// </summary>
        /// <param name="category">The category to add.</param>
        /// return new category

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Category))]
        [Authorize(Roles = "Administrator")]

        public async Task<ActionResult<Category>> AddCategoryAsync([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _service.AddCategory(category);
                return category;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "An error occurred while adding a new category.");
                return Conflict(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        /// <param name="id">The ID of the category to update.</param>
        /// <param name="category">The updated category.</param>

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> UpdateCategoryAsync(int id, [FromBody] Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _service.UpdateCategory(category);
            return NoContent();
        }

        /// <summary>
        /// Deletes an existing category.
        /// </summary>
        /// <param name="id">The ID of the category to delete.</param>
        
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> DeleteCategoryAsync(int id)
        {
            try
            {
                var category = await _service.GetCategoryById(id);
                if (category == null)
                {
                    return NotFound();
                }

                await _service.RemoveCategory(id);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while removing category with ID {CategoryId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while removing category with ID " + id + ". The DELETE statement conflicted with the REFERENCE constraint.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while removing category with ID {CategoryId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while removing category with ID " + id);
            }
        }
    }
}
