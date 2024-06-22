using Microsoft.EntityFrameworkCore;
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

        public ProductRepository(ProductCategoryContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task AddProduct(Product product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("Error occurred while adding product to database", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            try
            {
                return await _context.Products.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving all products", ex);
            }
        }

        public async Task<Product> GetProductById(int id)
        {
            try
            {
                return await _context.Products.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error occurred while retrieving product with ID {id}", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByCategory(int categoryId)
        {
            try
            {
                return await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error occurred while retrieving products for category with ID {categoryId}", ex);
            }
        }

        public async Task RemoveProduct(int id)
        {
            var product = await GetProductById(id);
            if (product != null)
            {
                try
                {
                    _context.Products.Remove(product);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    throw new Exception($"Error occurred while removing product with ID {id}", ex);
                }
            }
            else
            {
                throw new ArgumentException($"Product with ID {id} not found");
            }
        }

        public async Task UpdateProduct(Product product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            try
            {
                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("Error occurred while updating product in database", ex);
            }
        }

        public async Task<(IEnumerable<Product>, int)> GetProductsByPage(int pageNumber, int pageSize)
        {
            try
            {
                var totalCount = await _context.Products.CountAsync();
                var products = await _context.Products
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (products, totalCount);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error occurred while retrieving products page {pageNumber} with size {pageSize}", ex);
            }
        }
    }
}
