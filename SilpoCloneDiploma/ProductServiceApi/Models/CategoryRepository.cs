using Microsoft.EntityFrameworkCore;
using ProductServiceApi.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductServiceApi.Models
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ProductCategoryContext _context;

        public CategoryRepository(ProductCategoryContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task AddCategory(Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("Error occurred while adding category to database", ex);
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategory()
        {
            return await _context.Categories.Include(c => c.Products).ToListAsync();
        }

        public async Task<Category> GetCategoryById(int id)
        {
            try
            {
                return await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error occurred while retrieving category with ID {id}", ex);
            }
        }

        public async Task RemoveCategory(int id)
        {
            var category = await GetCategoryById(id);
            if (category != null)
            {
                try
                {
                    _context.Categories.Remove(category);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    throw new Exception($"Error occurred while removing category with ID {id}", ex);
                }
            }
            else
            {
                throw new ArgumentException($"Category with ID {id} not found");
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
                throw new Exception("Error occurred while updating category in database", ex);
            }
        }
    }
}
