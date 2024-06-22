using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        Task<(IEnumerable<Product>, int)> GetProductsByPage(int pageNumber, int pageSize);
    }
}
