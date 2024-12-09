using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using ProductServiceApi.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductServiceApi.Models
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductCategoryContext _context;
        private readonly ILogger<ProductRepository> _logger;

        public ProductRepository(ProductCategoryContext context, ILogger<ProductRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task AddProductAsync(Product product)
        {
            if (product == null)
            {
                _logger.LogWarning("Attempted to add a null product");
                throw new ArgumentNullException(nameof(product));
            }

            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Title == product.Title);
            if (existingProduct != null)
            {
                throw new InvalidOperationException($"Product with name '{product.Title}' already exists.");
            }

            var category = await _context.Categories.FindAsync(product.CategoryId);
            if (category == null)
            {
                throw new ArgumentException($"Category with ID {product.CategoryId} does not exist.");
            }

            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Product added successfully: {@Product}", product);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while adding product to database");
                throw new Exception("Error occurred while adding product to database", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            try
            {
                return await _context.Products.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all products");
                throw new Exception("Error occurred while retrieving all products", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsByCategoryAsync(int categoryId)
        {
            try
            {
                var allCategoryIds = await GetAllChildCategoryIdsAsync(categoryId);

                allCategoryIds.Add(categoryId);
                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => allCategoryIds.Contains(p.CategoryId)).ToList();
                return query;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all products");
                throw new Exception("Error occurred while retrieving all products", ex);
            }
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            try
            {
                return await _context.Products.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving product with ID {id}");
                throw new Exception($"Error occurred while retrieving product with ID {id}", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            try
            {
                return await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving products for category with ID {categoryId}");
                throw new Exception($"Error occurred while retrieving products for category with ID {categoryId}", ex);
            }
        }

        public async Task RemoveProductAsync(int id)
        {
            var product = await GetProductByIdAsync(id);
            if (product != null)
            {
                try
                {
                    _context.Products.Remove(product);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Product removed successfully: {@Product}", product);
                }
                catch (DbUpdateException ex)
                {
                    _logger.LogError(ex, $"Error occurred while removing product with ID {id}");
                    throw new Exception($"Error occurred while removing product with ID {id}", ex);
                }
            }
            else
            {
                _logger.LogWarning($"Attempted to remove a product that does not exist: ID {id}");
                throw new ArgumentException($"Product with ID {id} not found");
            }
        }

        public async Task<Product> GetProductByNameAsync(string title)
        {
            try
            {
                var product = await _context.Products
     .FirstOrDefaultAsync(p => p.Title.ToLower() == title.ToLower());

                if (product == null)
                {
                    _logger.LogWarning($"No product found with the title: {title}"); 
                }

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving product with name {title}");
                throw new Exception($"Error occurred while retrieving product with name {title}", ex);
            }
        }


        public async Task UpdateProductAsync(Product product)
        {
            if (product == null)
            {
                _logger.LogWarning("Attempted to update a null product");
                throw new ArgumentNullException(nameof(product));
            }

            try
            {
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Product updated successfully: {@Product}", product);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while updating product in database");
                throw new Exception("Error occurred while updating product in database", ex);
            }
        }
        /// will come in handy
        //public async Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize)
        //{
        //    try
        //    {
        //        var totalCount = await _context.Products.CountAsync();
        //        var products = await _context.Products
        //            .Skip((pageNumber - 1) * pageSize)
        //            .Take(pageSize)
        //            .ToListAsync();

        //        _logger.LogInformation("Retrieved page {PageNumber} of products with page size {PageSize}", pageNumber, pageSize);
        //        return (products, totalCount);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Error occurred while retrieving products page {pageNumber} with size {pageSize}");
        //        throw new Exception($"Error occurred while retrieving products page {pageNumber} with size {pageSize}", ex);
        //    }
        //}

        public async Task<(IEnumerable<Product>, int)> GetFilteredAndSortedProductsAsync(int pageNumber, int pageSize, int? categoryId, string sortName, ProductFilterDto filter)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Ratings)
                    .AsQueryable();

                if (categoryId.HasValue && categoryId > 0)
                {
                    var allCategoryIds = await GetAllChildCategoryIdsAsync(categoryId.Value);
                    allCategoryIds.Add(categoryId.Value);
                    query = query.Where(p => allCategoryIds.Contains(p.CategoryId));
                } 

                if (filter.Countries != null && filter.Countries.Any())
                {
                    query = query.Where(p => filter.Countries.Contains(p.CountryOfManufacture));
                }

                if (filter.Brands != null && filter.Brands.Any())
                {
                    query = query.Where(p => filter.Brands.Contains(p.TradeMark));
                }

                if (filter.MinPrice.HasValue || filter.MaxPrice.HasValue)
                {
                    query = query.Where(p =>
                        (filter.MinPrice.HasValue ?
                            (p.Discount.HasValue && p.Discount > 0
                                ? Math.Round((decimal)p.Price * (decimal)(1 - p.Discount.Value / 100), 2)
                                : (decimal)p.Price) >= filter.MinPrice.Value : true) &&
                        (filter.MaxPrice.HasValue ?
                            (p.Discount.HasValue && p.Discount > 0
                                ? Math.Round((decimal)p.Price * (decimal)(1 - p.Discount.Value / 100), 2)
                                : (decimal)p.Price) <= filter.MaxPrice.Value : true)
                    );
                }

                switch (sortName?.ToLower())
                {
                    case "popular":
                        query = query.OrderByDescending(p => p.Count);
                        break;
                    case "promotions":
                        query = query.OrderByDescending(p => p.Discount > 0);
                        break;
                    case "rating":
                        query = query.OrderByDescending(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Value) : 0);
                        break;
                    case "alphabetically":
                        query = query.OrderBy(p => p.Title);
                        break;
                    case "reversealphabetically":
                        query = query.OrderByDescending(p => p.Title);
                        break;
                    case "cheap":
                        query = query.OrderBy(p => p.Discount.HasValue && p.Discount > 0
                            ? Math.Round(p.Price * (1 - p.Discount.Value / 100), 2)
                            : p.Price);
                        break;
                    case "expensive":
                        query = query.OrderByDescending(p => p.Discount.HasValue && p.Discount > 0
                            ? Math.Round(p.Price * (1 - p.Discount.Value / 100), 2)
                            : p.Price);
                        break;
                    default:
                        break;
                }

                var totalCount = await query.CountAsync();

                if (totalCount == 0)
                {
                    return (Enumerable.Empty<Product>(), 0);
                }

                var skipCount = (pageNumber - 1) * pageSize;
                var products = await query
                    .Skip(skipCount)
                    .Take(pageSize)
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} filtered and sorted products on page {PageNumber} with applied filters",
                    products.Count, pageNumber);

                return (products, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving filtered and sorted products");
                throw new Exception("Error occurred while retrieving filtered and sorted products", ex);
            }
        }

        public async Task<(IEnumerable<Product>, int)> GetSortedProductsByPageAsync(int pageNumber, int pageSize, int categoryId, string sortName)
        {
            try
            {
                if (categoryId <= 0)
                {
                    throw new ArgumentException("Invalid categoryId", nameof(categoryId));
                }

                var allCategoryIds = await GetAllChildCategoryIdsAsync(categoryId);
                allCategoryIds.Add(categoryId);

                var query = _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Ratings)
                    .Where(p => allCategoryIds.Contains(p.CategoryId));

                switch (sortName.ToLower())
                {
                    case "popular":
                        query = query.OrderByDescending(p => p.Count);
                        break;
                    case "promotions":
                        query = query.OrderByDescending(p => p.Discount > 0); 
                        break;
                    case "rating":
                        query = query.OrderByDescending(p => p.Ratings.Any() ? p.Ratings.Average(r => r.Value) : 0);
                        break;
                    case "alphabetically":
                        query = query.OrderBy(p => p.Title);
                        break;
                    case "reversealphabetically":
                        query = query.OrderByDescending(p => p.Title);
                        break;
                    case "cheap":
                        query = query.OrderBy(p => p.Discount.HasValue && p.Discount > 0
                            ? Math.Round(p.Price * (1 - p.Discount.Value / 100), 2)
                            : p.Price);
                        break;
                    case "expensive":
                        query = query.OrderByDescending(p => p.Discount.HasValue && p.Discount > 0
                            ? Math.Round(p.Price * (1 - p.Discount.Value / 100), 2)
                            : p.Price);
                        break;
                    default:
                        break;
                }

                var totalCount = await query.CountAsync();

                var skipCount = (pageNumber - 1) * pageSize;
                if (skipCount >= totalCount)
                {
                    return (new List<Product>(), totalCount);
                }

                var products = await query
                    .Skip(skipCount)
                    .Take(pageSize)
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} products on page {PageNumber} with page size {PageSize} for category {CategoryId} and sort {SortName}",
                    products.Count, pageNumber, pageSize, categoryId, sortName);

                return (products, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving products page {pageNumber} with size {pageSize} for category {categoryId} and sort {sortName}");
                throw new Exception($"Error occurred while retrieving products page {pageNumber} with size {pageSize} for category {categoryId} and sort {sortName}", ex);
            }
        }


        public async Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize, int categoryId)
        {
            try
            {
                if (categoryId <= 0)
                {
                    throw new ArgumentException("Invalid categoryId", nameof(categoryId));
                }

                var allCategoryIds = await GetAllChildCategoryIdsAsync(categoryId);

                allCategoryIds.Add(categoryId);
                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => allCategoryIds.Contains(p.CategoryId));

                var totalCount = await query.CountAsync();

                var skipCount = (pageNumber - 1) * pageSize;
                if (skipCount >= totalCount)
                {
                    return (new List<Product>(), totalCount);
                }

                var products = await query
                    .Skip(skipCount)
                    .Take(pageSize)
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} products on page {PageNumber} with page size {PageSize} for category {CategoryId}",
                    products.Count, pageNumber, pageSize, categoryId);

                return (products, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving products page {pageNumber} with size {pageSize} for category {categoryId}");
                throw new Exception($"Error occurred while retrieving products page {pageNumber} with size {pageSize} for category {categoryId}", ex);
            }
        }

        private async Task<List<int>> GetAllChildCategoryIdsAsync(int parentCategoryId)
        {
            var childCategoryIds = new List<int>();

            var directChildren = await _context.Categories
                .Where(c => c.ParentCategoryId == parentCategoryId)
                .Select(c => c.Id)
                .ToListAsync();

            childCategoryIds.AddRange(directChildren);

            foreach (var childId in directChildren)
            {
                childCategoryIds.AddRange(await GetAllChildCategoryIdsAsync(childId));
            }

            return childCategoryIds;
        }

        public async Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize)
        {
            try
            {
                var products = await _context.Products
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var totalCount = await _context.Products.CountAsync();

                return (products, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching products.");
                throw; 
            }
        }
    }
}

