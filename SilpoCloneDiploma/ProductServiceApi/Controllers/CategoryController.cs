using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductServiceApi.Models;

namespace ProductServiceApi.Controllers
{
   
        [Route("api/[controller]")]
        [ApiController]
      //  [Authorize]
    // [OpenApiTag("Category", Description = "Operations related to categories")]
    public class CategoryController : ControllerBase
        {
            private readonly CategoryRepository _service;

            public CategoryController(CategoryRepository service)
            {
                _service = service;
            }

            [HttpGet]
           // [OpenApiOperation("GetAllCategoriesAsync", "Retrieve all categories")]
            [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Category>))]
            public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
            {
                return await _service.GetAllCategory();
            }

            [HttpGet("{id}")]
           // [OpenApiOperation("GetCategoryByIdAsync", "Retrieve a category by its ID")]
            [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Category))]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public async Task<ActionResult<Category>> GetCategoryByIdAsync(int id)
            {
                var category = _service.GetCategoryById(id);
                if (category == null)
                {
                    return NotFound();
                }
                return await category;
            }

            [HttpPost]
            //[OpenApiOperation("AddCategory", "Add a new category")]
            [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Category))]
            public ActionResult<Category> AddCategory([FromBody] Category category)
            {
                _service.AddCategory(category);
                return CreatedAtAction(nameof(GetCategoryByIdAsync), new { id = category.Id }, category);
            }

            [HttpPut("{id}")]
            //[OpenApiOperation("UpdateCategory", "Update a category")]
            [ProducesResponseType(StatusCodes.Status204NoContent)]
            [ProducesResponseType(StatusCodes.Status400BadRequest)]
            public IActionResult UpdateCategory(int id, [FromBody] Category category)
            {
                if (id != category.Id)
                {
                    return BadRequest();
                }

                _service.UpdateCategory(category);
                return NoContent();
            }

            [HttpDelete("{id}")]
            //[OpenApiOperation("DeleteCategory", "Delete a category")]
            [ProducesResponseType(StatusCodes.Status204NoContent)]
            public IActionResult DeleteCategory(int id)
            {
                _service.RemoveCategory(id);
                return NoContent();
            }
        }
}
