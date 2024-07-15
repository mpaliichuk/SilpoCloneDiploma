using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _service;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IProductRepository service, ILogger<ProductController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets all product
        /// </summary>
       
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Product>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProductsAsync()
        {
            var products = await _service.GetAllProducts();
            return Ok(products);
        }

        /// <summary>
        /// Gets product bt Id
        /// </summary>
       
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Product))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Product>> GetProductByIdAsync(int id)
        {
            var product = await _service.GetProductById(id);
            if (product == null)
            {
                _logger.LogWarning($"Product with ID {id} not found.");
                return NotFound();
            }
            return Ok(product);
        }

        /// <summary>
        /// Gets product by Name
        /// </summary>
        
        [HttpGet("title/{title}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Product))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetProductByNameAsync(string title)
        {
            var product = await _service.GetProductByName(title);
            if (product == null)
            {
                _logger.LogWarning($"Product with title '{title}' not found.");
                return NotFound();
            }
            return Ok(product);
        }

        /// <summary>
        /// Paggination
        /// </summary>
        
        [HttpGet("page/{pageNumber}/size/{pageSize}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<Product>, int)>> GetProductsByPageAsync(int pageNumber, int pageSize)
        {
            var (products, totalCount) = await _service.GetProductsByPage(pageNumber, pageSize);
            _logger.LogInformation($"Retrieved page {pageNumber} of products with page size {pageSize}");
            return Ok(new { Products = products, TotalCount = totalCount });
        }

        /// <summary>
        /// Add new Product
        /// return new product;
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Product))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Product>> AddProductAsync([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid product model state.");
                return BadRequest(ModelState);
            }

            try
            {
                await _service.AddProduct(product);
                return  product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a new product.");
                return BadRequest("Error occurred while adding a new product.");
            }
        }

        /// <summary>
        /// Update product by id
        /// return NoContent();
        /// </summary>

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateProductAsync(int id, [FromBody] Product product)
        {
            if (id != product.Id)
            {
                _logger.LogWarning("Product ID mismatch in update request.");
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid product model state in update request.");
                return BadRequest(ModelState);
            }

            try
            {
                await _service.UpdateProduct(product);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the product.");
                return BadRequest("Error occurred while updating the product.");
            }
        }

        /// <summary>
        /// Delete product by Id
        /// return NoContent();
        /// </summary>

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _service.GetProductById(id);
                if (product == null)
                {
                    return NotFound();
                }

                await _service.RemoveProduct(id);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while removing product with ID {ProductId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while removing product with ID " + id + ". The DELETE statement conflicted with the REFERENCE constraint.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting product with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while deleting the product.");
            }
        }

    }
}
