using ProductServiceApi.Contracts;

namespace ProductServiceApi.Models
{
    public class ProductRepository : IProductRepository
    {
        public Task AddProduct(Product product)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Product>> GetAllProducts()
        {
            throw new NotImplementedException();
        }

        public Task<Product> GetProductById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Product>> GetProductsByCategory(int categoryId)
        {
            throw new NotImplementedException();
        }

        public Task RemoveProduct(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateProduct(Product product)
        {
            throw new NotImplementedException();
        }
    }
}
