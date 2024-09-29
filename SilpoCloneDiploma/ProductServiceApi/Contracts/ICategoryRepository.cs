using ProductServiceApi.Models;

namespace ProductServiceApi.Contracts
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category> GetCategoryByIdAsync(int id);
        Task<Category> GetCategoryByNameAsync(string name);
        Task AddCategoryAsync(Category category);
        Task UpdateCategoryAsync(Category category);
        Task RemoveCategoryAsync(int id);
    }
}
