using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    public interface IProductRepository
    {
        Task AddProduct(Product product);
        Task<IEnumerable<Product>> GetAllProducts();
        Task<Product> GetProductById(int id);
        Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        Task RemoveProduct(int id);
        Task UpdateProduct(Product product);
        Task<(IEnumerable<Product>, int)> GetProductsByPage(int pageNumber, int pageSize);
        Task<Product> GetProductByName(string name); 
    }
}
