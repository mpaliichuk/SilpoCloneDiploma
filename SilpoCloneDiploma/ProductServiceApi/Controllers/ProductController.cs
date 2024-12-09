using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using ProductServiceApi.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using ProductServiceApi.Models.Dto;

namespace ProductServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _service;
        private readonly IRatingRepository _serviceRating;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IProductRepository service, IRatingRepository serviceRating, ILogger<ProductController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service), "Product service cannot be null");
            _serviceRating = serviceRating ?? throw new ArgumentNullException(nameof(serviceRating), "Rating service cannot be null");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger), "Logger cannot be null");
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
                Availability = (Dtos.Availability)p.Availability,
                Weight = p.Weight,
                TradeMark = p.TradeMark,
                CountryOfManufacture = p.CountryOfManufacture,
                Count = p.Count,
                Discount = p.Discount,
                Price = p.Price,
                CategoryId = p.CategoryId
            });

            return Ok(productDtos);
        }

        /// <summary>
        /// Get 8 random products by category.
        /// </summary>
        [HttpGet("random-same-category/{productId}/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductDto>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetRandomProductsByCategoryAsync(int productId, int categoryId)
        {
            var products = await _service.GetAllProductsAsync();

            var discountedProducts = products.Where(p => p.CategoryId == categoryId && p.Id != productId).ToList();

            if (discountedProducts.Count < 8)
            {
                int productsToAdd = 8 - discountedProducts.Count;

                var randomNonCategoryProducts = products
                    .Where(p => p.CategoryId != categoryId)
                    .OrderBy(p => Guid.NewGuid())
                    .Take(productsToAdd)
                    .ToList();

                discountedProducts.AddRange(randomNonCategoryProducts);
            }

            var randomProducts = discountedProducts
                .OrderBy(p => Guid.NewGuid())
                .Take(8)
                .ToList();

            var productDtos = randomProducts.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                ProductComposition = p.ProductComposition,
                GeneralInformation = p.GeneralInformation,
                ImageUrls = p.ImageUrls,
                Availability = (Dtos.Availability)p.Availability,
                Weight = p.Weight,
                TradeMark = p.TradeMark,
                CountryOfManufacture = p.CountryOfManufacture,
                Count = p.Count,
                Discount = p.Discount,
                Price = p.Price,
                CategoryId = p.CategoryId
            });

            return Ok(productDtos);
        }

        /// <summary>
        /// Get 8 random products.
        /// </summary>
        [HttpGet("random-recommendation")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductDto>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetRandomProductsAsync()
        {
            var products = await _service.GetAllProductsAsync();
            var discountedProducts = products.ToList();

            var randomProducts = discountedProducts
                .OrderBy(p => Guid.NewGuid())
                .Take(8)
                .ToList();

            var productDtos = randomProducts.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                ProductComposition = p.ProductComposition,
                GeneralInformation = p.GeneralInformation,
                ImageUrls = p.ImageUrls,
                Availability = (Dtos.Availability)p.Availability,
                Weight = p.Weight,
                TradeMark = p.TradeMark,
                CountryOfManufacture = p.CountryOfManufacture,
                Count = p.Count,
                Discount = p.Discount,
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
            var discountedProducts = products.Where(p => p.Discount > 0);

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
                Availability = (Dtos.Availability)p.Availability,
                Weight = p.Weight,
                TradeMark = p.TradeMark,
                CountryOfManufacture = p.CountryOfManufacture,
                Count = p.Count,
                Discount = p.Discount,
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

            var ratings = await _serviceRating.GetAllRatingsAsync();

            var productRatings = ratings.Where(r => r.IdProduct == product.Id).ToList();
            double averageRating = productRatings.Any() ? Math.Round(productRatings.Average(r => r.Value), 2) : 0;
            int ratingCount = productRatings.Count;

            var productDto = new ProductDto
            {
                Title = product.Title,
                ProductComposition = product.ProductComposition,
                GeneralInformation = product.GeneralInformation,
                ImageUrls = product.ImageUrls,
                Availability = (Dtos.Availability)product.Availability,
                Weight = product.Weight,
                TradeMark = product.TradeMark,
                CountryOfManufacture = product.CountryOfManufacture,
                Count = product.Count,
                Discount = product.Discount,
                Price = product.Price,
                CategoryId = product.CategoryId,
                AverageRating = averageRating,
                RatingCount = ratingCount
            };

            return Ok(productDto);
        }

        /// <summary>
        /// Get a product by name.
        /// </summary>
        /// <param name="title">The name of the product.</param>
        [HttpGet("GetProductByNameAsync/{title}")]
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
                Id = product.Id,
                Title = product.Title,
                ProductComposition = product.ProductComposition,
                GeneralInformation = product.GeneralInformation,
                ImageUrls = product.ImageUrls,
                Availability = (Dtos.Availability)product.Availability,
                Weight = product.Weight,
                TradeMark = product.TradeMark,
                CountryOfManufacture = product.CountryOfManufacture,
                Count = product.Count,
                Discount = product.Discount,
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
        [HttpGet("page/{pageNumber}/size/{pageSize}/category/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<ProductDto>, int)>> GetProductsByPageAsync(int pageNumber, int pageSize, int categoryId)
        {
            try
            {
                var (products, totalCount) = await _service.GetProductsByPageAsync(pageNumber, pageSize, categoryId);

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    ProductComposition = p.ProductComposition,
                    GeneralInformation = p.GeneralInformation,
                    ImageUrls = p.ImageUrls,
                    Availability = (Dtos.Availability)p.Availability,
                    Weight = p.Weight,
                    TradeMark = p.TradeMark,
                    CountryOfManufacture = p.CountryOfManufacture,
                    Count = p.Count,
                    Discount = p.Discount,
                    Price = p.Price,
                    CategoryId = p.CategoryId
                });

                return Ok(new { Products = productDtos, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving products.");
                return StatusCode(500, "An error occurred while retrieving products.");
            }
        }

        /// <summary>
        /// Get products with pagination.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        [HttpGet("sortedPage/{pageNumber}/size/{pageSize}/category/{categoryId}/sortBy/{sortName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<ProductDto>, int)>> GetSortedProductsByPageAsync(int pageNumber, int pageSize, int categoryId, string sortName)
        {
            try
            {
                var (products, totalCount) = await _service.GetSortedProductsByPageAsync(pageNumber, pageSize, categoryId, sortName);

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    ProductComposition = p.ProductComposition,
                    GeneralInformation = p.GeneralInformation,
                    ImageUrls = p.ImageUrls,
                    Availability = (Dtos.Availability)p.Availability,
                    Weight = p.Weight,
                    TradeMark = p.TradeMark,
                    CountryOfManufacture = p.CountryOfManufacture,
                    Count = p.Count,
                    Discount = p.Discount,
                    Price = p.Price,
                    CategoryId = p.CategoryId
                });

                return Ok(new { Products = productDtos, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving products.");
                return StatusCode(500, "An error occurred while retrieving products.");
            }
        }

        /// <summary>
        /// Get products with filtered/sorted pagination.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        [HttpPost("sortedFilteredPage/{pageNumber}/size/{pageSize}/category/{categoryId}/sortBy/{sortName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<ProductDto>, int)>> GetFilteredAndSortedProductsAsync(ProductFilterDto filter, int pageNumber, int pageSize, int categoryId, string sortName)
        {
            try
            {
                IEnumerable<Product> products;
                int totalCount;

                if (filter != null)
                {
                    (products, totalCount) = await _service.GetFilteredAndSortedProductsAsync(pageNumber, pageSize, categoryId, sortName, filter);
                }
                else
                {
                    (products, totalCount) = await _service.GetSortedProductsByPageAsync(pageNumber, pageSize, categoryId, sortName);
                }

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    ProductComposition = p.ProductComposition,
                    GeneralInformation = p.GeneralInformation,
                    ImageUrls = p.ImageUrls,
                    Availability = (Dtos.Availability)p.Availability,
                    Weight = p.Weight,
                    TradeMark = p.TradeMark,
                    CountryOfManufacture = p.CountryOfManufacture,
                    Count = p.Count,
                    Discount = p.Discount,
                    Price = p.Price,
                    CategoryId = p.CategoryId
                });

                return Ok(new { Products = productDtos, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving products.");
                return StatusCode(500, "An error occurred while retrieving products.");
            }
        }

        [HttpGet("GetFilters/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CountryAndTradeMarkDto>))]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CountryAndTradeMarkDto>>> GetFiltersAsync(int categoryId)
        {
            try
            {
                var products = await _service.GetAllProductsByCategoryAsync(categoryId);

                var groupedData = products
                    .GroupBy(p => new { p.CountryOfManufacture, p.TradeMark })
                    .Select(g => new CountryAndTradeMarkDto
                    {
                        Country = g.Key.CountryOfManufacture,
                        TradeMark = g.Key.TradeMark,
                        Count = g.Count()
                    });

                return Ok(groupedData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving filters for categoryId: {CategoryId}", categoryId);
                return StatusCode(500, "An error occurred while retrieving filters.");
            }
        }

        /// <summary>
        /// Get products with pagination, without category filter.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        [HttpGet("page/{pageNumber}/size/{pageSize}/no-category")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<(IEnumerable<ProductDto>, int)>> GetProductsByPageWithoutCategoryAsync(int pageNumber, int pageSize)
        {
            try
            {
                var (products, totalCount) = await _service.GetProductsByPageAsync(pageNumber, pageSize); 

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    ProductComposition = p.ProductComposition,
                    GeneralInformation = p.GeneralInformation,
                    ImageUrls = p.ImageUrls,
                    Availability = (Dtos.Availability)p.Availability,
                    Weight = p.Weight,
                    TradeMark = p.TradeMark,
                    CountryOfManufacture = p.CountryOfManufacture,
                    Count = p.Count,
                    Discount = p.Discount,
                    Price = p.Price,
                    CategoryId = p.CategoryId
                });

                return Ok(new { Products = productDtos, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving products.");
                return StatusCode(500, "An error occurred while retrieving products.");
            }
        }


        /// <summary>
        /// Add a new product.
        /// </summary>
        /// <param name="productDto">The product to add.</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[Authorize(Roles = "Administrator")]
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
                    Availability = (Models.Availability)productDto.Availability,
                    Weight = productDto.Weight,
                    TradeMark = productDto.TradeMark,
                    CountryOfManufacture = productDto.CountryOfManufacture,
                    Count = productDto.Count,
                    Discount = productDto.Discount,
                    Price = productDto.Price,
                    CategoryId = productDto.CategoryId
                };
                try { await _service.AddProductAsync(product); }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while adding the product: {ex.Message}");
                }

                _logger.LogInformation("Product added successfully: {@Product}", product);

                var addedProductDto = new ProductDto
                {
                    Title = product.Title,
                    ProductComposition = product.ProductComposition,
                    GeneralInformation = product.GeneralInformation,
                    ImageUrls = product.ImageUrls,
                    Availability = (Dtos.Availability)product.Availability,
                    Weight = product.Weight,
                    TradeMark = product.TradeMark,
                    CountryOfManufacture = product.CountryOfManufacture,
                    Count = product.Count,
                    Discount = product.Discount,
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
        // [Authorize(Roles = "Administrator")]
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
                existingProduct.Availability = (Models.Availability)productDto.Availability;
                existingProduct.Weight = productDto.Weight;
                existingProduct.TradeMark = productDto.TradeMark;
                existingProduct.CountryOfManufacture = productDto.CountryOfManufacture;
                existingProduct.Count = productDto.Count;
                existingProduct.Discount = productDto.Discount;
                existingProduct.Price = productDto.Price;
                existingProduct.CategoryId = productDto.CategoryId;

                await _service.UpdateProductAsync(existingProduct);
                _logger.LogInformation("Product updated successfully: {@Product}", existingProduct);
                return Ok(productDto);
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
        // [Authorize(Roles = "Administrator")]
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
        /// <summary>
        /// Get the total count of products.
        /// </summary>
        /// <returns>The total number of products.</returns>
        [HttpGet("count")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(int))]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetProductsCountAsync()
        {
            try
            {
                var products = await _service.GetAllProductsAsync();  // Fetch all products
                var productCount = products.Count();  // Count the number of products

                return Ok(productCount);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while fetching product count: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching the product count.");
            }
        }

    }
}
