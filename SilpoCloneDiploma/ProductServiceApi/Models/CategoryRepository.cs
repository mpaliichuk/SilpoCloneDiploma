using ProductServiceApi.Contracts;

namespace ProductServiceApi.Models
{
    public class CategoryRepository : ICategoryRepository
    {
        public Task AddCategory(Category category)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Category>> GetAllCategory()
        {
            throw new NotImplementedException();
        }

        public Task<Category> GetCategoryById(int id)
        {
            throw new NotImplementedException();
        }

        public Task RemoveCategory(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateCategory(Category category)
        {
            throw new NotImplementedException();
        }
    }
}
