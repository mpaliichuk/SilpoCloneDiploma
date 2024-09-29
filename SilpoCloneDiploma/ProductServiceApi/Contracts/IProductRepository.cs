using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    public interface IProductRepository
    {
        Task AddProductAsync(Product product); 
        Task<IEnumerable<Product>> GetAllProductsAsync(); 
        Task<Product> GetProductByIdAsync(int id); 
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId); 
        Task RemoveProductAsync(int id); 
        Task UpdateProductAsync(Product product); 
        Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize); 
        Task<Product> GetProductByNameAsync(string name); 
    }
}
