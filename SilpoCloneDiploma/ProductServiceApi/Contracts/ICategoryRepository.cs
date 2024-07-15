using ProductServiceApi.Models;

namespace ProductServiceApi.Contracts
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategory();
        Task<Category> GetCategoryById(int id);
        Task<Category> GetCategoryByName(string name);
        Task AddCategory(Category category);
        Task UpdateCategory(Category category);
        Task RemoveCategory(int id);
    }
}
