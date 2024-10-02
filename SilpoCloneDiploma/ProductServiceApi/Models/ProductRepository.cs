﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
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

        public async Task AddProductAsync(Product product) // Додано Async
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

        public async Task<IEnumerable<Product>> GetAllProductsAsync() // Додано Async
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

        public async Task<Product> GetProductByIdAsync(int id) // Додано Async
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

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId) // Додано Async
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

        public async Task RemoveProductAsync(int id) // Додано Async
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

        public async Task<Product> GetProductByNameAsync(string title) // Додано Async
        {
            try
            {
                return await _context.Products.FirstOrDefaultAsync(p => p.Title == title);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving product with name {title}");
                throw new Exception($"Error occurred while retrieving product with name {title}", ex);
            }
        }

        public async Task UpdateProductAsync(Product product) // Додано Async
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

        public async Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize) // Додано Async
        {
            try
            {
                var totalCount = await _context.Products.CountAsync();
                var products = await _context.Products
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                _logger.LogInformation("Retrieved page {PageNumber} of products with page size {PageSize}", pageNumber, pageSize);
                return (products, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving products page {pageNumber} with size {pageSize}");
                throw new Exception($"Error occurred while retrieving products page {pageNumber} with size {pageSize}", ex);
            }
        }
    }
}