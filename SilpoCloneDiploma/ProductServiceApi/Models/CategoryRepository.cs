using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Models
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ProductCategoryContext _context;
        private readonly ILogger<CategoryRepository> _logger;

        public CategoryRepository(ProductCategoryContext context, ILogger<CategoryRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task AddCategory(Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == category.Name);
            if (existingCategory != null)
            {
                throw new InvalidOperationException($"Category with name '{category.Name}' already exists.");
            }

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while adding category to database");
                throw new Exception("Error occurred while adding category to database", ex);
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategory()
        {
            try
            {
                return await _context.Categories.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all categories");
                throw new Exception("Error occurred while retrieving all categories", ex);
            }
        }

        public async Task<Category> GetCategoryById(int id)
        {
            try
            {
                return await _context.Categories.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving category with ID {id}");
                throw new Exception($"Error occurred while retrieving category with ID {id}", ex);
            }
        }

        public async Task<Category> GetCategoryByName(string name)
        {
            try
            {
                return await _context.Categories.FirstOrDefaultAsync(c => c.Name == name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving category with name {name}");
                throw new Exception($"Error occurred while retrieving category with name {name}", ex);
            }
        }

        public async Task RemoveCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category != null)
                {
                    _context.Categories.Remove(category);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _logger.LogWarning($"Category with ID {id} not found");
                }
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Error occurred while removing category with ID {id}");
                throw new Exception($"Error occurred while removing category with ID {id}", ex);
            }
        }

        public async Task UpdateCategory(Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            try
            {
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while updating category in database");
                throw new Exception("Error occurred while updating category in database", ex);
            }
        }
    }
}
