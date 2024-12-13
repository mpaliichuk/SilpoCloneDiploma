using ProductServiceApi.Models;
using ProductServiceApi.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    public interface IProductRepository
    {
        Task AddProductAsync(Product product); 
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<IEnumerable<Product>> GetAllProductsByCategoryAsync(int categoryId);
        Task<Product> GetProductByIdAsync(int id); 
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId); 
        Task RemoveProductAsync(int id); 
        Task UpdateProductAsync(Product product); 
        Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize, int categoryId);
        Task<(IEnumerable<Product>, int)> GetSortedProductsByPageAsync(int pageNumber, int pageSize, int categoryId, string sortName);
        Task<(IEnumerable<Product>, int)> GetFilteredAndSortedProductsAsync(int pageNumber, int pageSize, int? categoryId, string sortName, ProductFilterDto filter);
        Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize); 
        Task<Product> GetProductByNameAsync(string name); 
    }
}
