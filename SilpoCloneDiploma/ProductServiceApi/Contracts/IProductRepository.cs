using ProductServiceApi.Models;

namespace ProductServiceApi.Contracts
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProducts();
        Task<Product> GetProductById(int id);
        Task AddProduct(Product product);
        Task UpdateProduct(Product product);
        Task RemoveProduct(int id);
        Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
    }
}
