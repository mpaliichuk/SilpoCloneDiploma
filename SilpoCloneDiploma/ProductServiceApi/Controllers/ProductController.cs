using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using ProductServiceApi.Models.Dto;
using ProductServiceApi.Models.Dto.ProductServiceApi.Dtos;
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
        /// Get all products.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductDto>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProductsAsync()
        {
            var products = await _service.GetAllProductsAsync();
            Console.Write(products);
            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                ProductComposition = p.ProductComposition,
                GeneralInformation = p.GeneralInformation,
                ImageUrls = p.ImageUrls,
                Availability = p.Availability,
                Count = p.Count,
                Sale = p.Sale,
                Price = p.Price,
                CategoryId = p.CategoryId
            });

            return Ok(productDtos);
        }

        /// <summary>
        /// Get 18 random discounted products.
        /// </summary>
        [HttpGet("random-discounted")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductDto>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetRandomDiscountedProductsAsync()
        {
            var products = await _service.GetAllProductsAsync();
            var discountedProducts = products.Where(p => p.Sale > 0);

            var randomProducts = discountedProducts
                .OrderBy(p => Guid.NewGuid())
                .Take(18)
                .ToList();

            var productDtos = randomProducts.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                ProductComposition = p.ProductComposition,
                GeneralInformation = p.GeneralInformation,
                ImageUrls = p.ImageUrls,
                Availability = p.Availability,
                Count = p.Count,
                Sale = p.Sale,
                Price = p.Price,
                CategoryId = p.CategoryId
            });

            return Ok(productDtos);
        }


        /// <summary>
        /// Get a product by ID.
        /// </summary>
        /// <param name="id">The ID of the product.</param>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [AllowAnonymous]
        //[Authorize(Roles = "Administrator")]
        public async Task<ActionResult<ProductDto>> GetProductByIdAsync(int id)
        {
            var product = await _service.GetProductByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning($"Product with ID {id} not found.");
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Title = product.Title,
                ProductComposition = product.ProductComposition,
                GeneralInformation = product.GeneralInformation,
                ImageUrls = product.ImageUrls,
                Availability = product.Availability,
                Count = product.Count,
                Sale = product.Sale,
                Price = product.Price,
                CategoryId = product.CategoryId
            };

            return Ok(productDto);
        }

        /// <summary>
        /// Get a product by name.
        /// </summary>
        /// <param name="title">The name of the product.</param>
        [HttpGet("title/{title}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [AllowAnonymous]
        public async Task<ActionResult<ProductDto>> GetProductByNameAsync(string title)
        {
            var product = await _service.GetProductByNameAsync(title);
            if (product == null)
            {
                _logger.LogWarning($"Product with title '{title}' not found.");
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Title = product.Title,
                ProductComposition = product.ProductComposition,
                GeneralInformation = product.GeneralInformation,
                ImageUrls = product.ImageUrls,
                Availability = product.Availability,
                Count = product.Count,
                Sale = product.Sale,
                Price = product.Price,
                CategoryId = product.CategoryId
            };

            return Ok(productDto);
        }

        /// <summary>
        /// Get products with pagination.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        [HttpGet("page/{pageNumber}/size/{pageSize}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<ProductDto>, int)>> GetProductsByPageAsync(int pageNumber, int pageSize)
        {
            var (products, totalCount) = await _service.GetProductsByPageAsync(pageNumber, pageSize);
            var productDtos = products.Select(p => new ProductDto
            {
                Title = p.Title,
                ProductComposition = p.ProductComposition,
                GeneralInformation = p.GeneralInformation,
                ImageUrls = p.ImageUrls,
                Availability = p.Availability,
                Count = p.Count,
                Sale = p.Sale,
                Price = p.Price,
                CategoryId = p.CategoryId
            });

            _logger.LogInformation($"Retrieved page {pageNumber} of products with page size {pageSize}");
            return Ok(new { Products = productDtos, TotalCount = totalCount });
        }

        /// <summary>
        /// Add a new product.
        /// </summary>
        /// <param name="productDto">The product to add.</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<ProductDto>> AddProductAsync([FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid product DTO state.");
                return BadRequest(ModelState);
            }

            try
            {
                var product = new Product
                {
                    Title = productDto.Title,
                    ProductComposition = productDto.ProductComposition,
                    GeneralInformation = productDto.GeneralInformation,
                    ImageUrls = productDto.ImageUrls,
                    Availability = productDto.Availability,
                    Count = productDto.Count,
                    Sale = productDto.Sale,
                    Price = productDto.Price,
                    CategoryId = productDto.CategoryId
                };

                await _service.AddProductAsync(product);
                _logger.LogInformation("Product added successfully: {@Product}", product);

                var addedProductDto = new ProductDto
                {
                    Title = product.Title,
                    ProductComposition = product.ProductComposition,
                    GeneralInformation = product.GeneralInformation,
                    ImageUrls = product.ImageUrls,
                    Availability = product.Availability,
                    Count = product.Count,
                    Sale = product.Sale,
                    Price = product.Price,
                    CategoryId = product.CategoryId
                };

                return addedProductDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a new product.");
                return BadRequest("Error occurred while adding a new product.");
            }
        }

        /// <summary>
        /// Update an existing product.
        /// </summary>
        /// <param name="id">The ID of the product to update.</param>
        /// <param name="productDto">The updated product.</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateProductAsync(int id, [FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid product DTO state in update request.");
                return BadRequest(ModelState);
            }

            try
            {
                var existingProduct = await _service.GetProductByIdAsync(id);
                if (existingProduct == null)
                {
                    _logger.LogWarning($"Product with ID {id} not found.");
                    return NotFound();
                }

                // Оновлюємо властивості існуючого продукту з DTO
                existingProduct.Title = productDto.Title;
                existingProduct.ProductComposition = productDto.ProductComposition;
                existingProduct.GeneralInformation = productDto.GeneralInformation;
                existingProduct.ImageUrls = productDto.ImageUrls;
                existingProduct.Availability = productDto.Availability;
                existingProduct.Count = productDto.Count;
                existingProduct.Sale = productDto.Sale;
                existingProduct.Price = productDto.Price;
                existingProduct.CategoryId = productDto.CategoryId;

                await _service.UpdateProductAsync(existingProduct);
                _logger.LogInformation("Product updated successfully: {@Product}", existingProduct);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the product.");
                return BadRequest("Error occurred while updating the product.");
            }
        }

        /// <summary>
        /// Delete an existing product.
        /// </summary>
        /// <param name="id">The ID of the product to delete.</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _service.GetProductByIdAsync(id);
                if (product == null)
                {
                    _logger.LogWarning($"Product with ID {id} not found.");
                    return NotFound();
                }

                await _service.RemoveProductAsync(id);
                _logger.LogInformation("Product removed successfully: ID {ProductId}", id);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while removing product with ID {ProductId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while removing product. The DELETE statement conflicted with the REFERENCE constraint.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while removing product with ID {ProductId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while removing the product.");
            }
        }
    }
}
