using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using ProductServiceApi.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _service;
        private readonly IProductRepository _serviceProduct;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryRepository service, IProductRepository serviceProduct, ILogger<CategoryController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _serviceProduct = serviceProduct ?? throw new ArgumentNullException(nameof(serviceProduct));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Get all categories.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CategoryDto>))]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategoriesAsync()
        {
            var categories = await _service.GetAllCategoriesAsync();
            var categoryDtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                ParentCategoryId = c.ParentCategoryId
            });
            return Ok(categoryDtos);
        }

        /// <summary>
        /// Gets a category by ID.
        /// </summary>
        /// <param name="id">The ID of the category.</param>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CategoryDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //[Authorize(Roles = "Administrator")]
        public async Task<ActionResult<CategoryDto>> GetCategoryByIdAsync(int id)
        {
            var category = await _service.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId,
                ParentCategoryName = ""
            };

            if (categoryDto.ParentCategoryId != null)
            {
                var parentCategory = await _service.GetCategoryByIdAsync((int)categoryDto.ParentCategoryId);
                if (parentCategory != null)
                {
                    categoryDto.ParentCategoryName = parentCategory.Name;
                }
            }

            return Ok(categoryDto);
        }

        /// <summary>
        /// Gets a category by ID.
        /// </summary>
        /// <param name="id">The ID of the category.</param>
        [HttpGet("getParent/{parentId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<SubCategoryDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetParentCategoryByIdAsync(int parentId)
        {
            var categories = await _service.GetAllCategoriesAsync();
            var products = await _serviceProduct.GetAllProductsAsync();

            var subCategories = categories.Where(c => c.ParentCategoryId == parentId);

            if (!subCategories.Any())
            {
                return NotFound();
            }

            var categoryDtos = subCategories.Select(c => new SubCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                ParentCategoryId = c.ParentCategoryId,
                Count = products.Count(p => p.CategoryId == c.Id),
            });

            return Ok(categoryDtos);
        }

        /// <summary>
        /// Get a category by name.
        /// </summary>
        /// <param name="name">The name of the category.</param>
        [HttpGet("name/{name}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CategoryDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryDto>> GetCategoryByNameAsync(string name)
        {
            var category = await _service.GetCategoryByNameAsync(name);
            if (category == null)
            {
                return NotFound();
            }

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId
            };
            return Ok(categoryDto);
        }

        /// <summary>
        /// Add a new category.
        /// </summary>
        /// <param name="categoryDto">The category to add.</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CategoryDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<CategoryDto>> AddCategoryAsync([FromBody] CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var category = new Category
                {
                    Name = categoryDto.Name,
                    ParentCategoryId = categoryDto.ParentCategoryId
                };

                await _service.AddCategoryAsync(category);
                _logger.LogInformation("Category added successfully: {@Category}", category);

                var addedCategoryDto = new CategoryDto
                {
                    Id = category.Id, 
                    Name = category.Name,
                    ParentCategoryId = category.ParentCategoryId
                };

                return addedCategoryDto;
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
        /// <param name="categoryDto">The updated category.</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateCategoryAsync(int id, [FromBody] CategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingCategory = await _service.GetCategoryByIdAsync(id);
                if (existingCategory == null)
                {
                    return NotFound();
                }

                // Оновлюємо властивості існуючої категорії з DTO
                existingCategory.Name = categoryDto.Name;
                existingCategory.ParentCategoryId = categoryDto.ParentCategoryId;

                await _service.UpdateCategoryAsync(existingCategory);
                _logger.LogInformation("Category updated successfully: {@Category}", existingCategory);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while updating category with ID {CategoryId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while updating category.");
            }
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
                var category = await _service.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound();
                }

                await _service.RemoveCategoryAsync(id);
                _logger.LogInformation("Category removed successfully: ID {CategoryId}", id);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while removing category with ID {CategoryId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while removing category.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while removing category with ID {CategoryId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while removing category.");
            }
        }
    }
}
