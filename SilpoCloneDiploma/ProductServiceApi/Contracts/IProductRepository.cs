using ProductServiceApi.Models;
using ProductServiceApi.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    /// <summary>
    /// Interface for managing product data.
    /// </summary>
    public interface IProductRepository
    {
        /// <summary>
        /// Adds a new product asynchronously.
        /// </summary>
        /// <param name="product">The product to add.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddProductAsync(Product product);

        /// <summary>
        /// Gets all products asynchronously.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, with a collection of products.</returns>
        Task<IEnumerable<Product>> GetAllProductsAsync();

        /// <summary>
        /// Gets all products by category asynchronously.
        /// </summary>
        /// <param name="categoryId">The category identifier.</param>
        /// <returns>A task representing the asynchronous operation, with a collection of products in the specified category.</returns>
        Task<IEnumerable<Product>> GetAllProductsByCategoryAsync(int categoryId);

        /// <summary>
        /// Gets a product by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the product.</param>
        /// <returns>A task representing the asynchronous operation, with the product if found.</returns>
        Task<Product> GetProductByIdAsync(int id);

        /// <summary>
        /// Gets products by category asynchronously.
        /// </summary>
        /// <param name="categoryId">The category identifier.</param>
        /// <returns>A task representing the asynchronous operation, with a collection of products in the specified category.</returns>
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);

        /// <summary>
        /// Removes a product by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the product to remove.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveProductAsync(int id);

        /// <summary>
        /// Updates an existing product asynchronously.
        /// </summary>
        /// <param name="product">The product with updated information.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateProductAsync(Product product);

        /// <summary>
        /// Gets products by page asynchronously.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="categoryId">The category identifier (optional).</param>
        /// <returns>A task representing the asynchronous operation, with a collection of products and the total count.</returns>
        Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize, int categoryId);

        /// <summary>
        /// Gets sorted products by page asynchronously.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="categoryId">The category identifier (optional).</param>
        /// <param name="sortName">The sorting name.</param>
        /// <returns>A task representing the asynchronous operation, with a collection of sorted products and the total count.</returns>
        Task<(IEnumerable<Product>, int)> GetSortedProductsByPageAsync(int pageNumber, int pageSize, int categoryId, string sortName);

        /// <summary>
        /// Gets filtered and sorted products asynchronously.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="categoryId">The category identifier (optional).</param>
        /// <param name="sortName">The sorting name.</param>
        /// <param name="filter">The product filter DTO.</param>
        /// <returns>A task representing the asynchronous operation, with a collection of filtered and sorted products and the total count.</returns>
        Task<(IEnumerable<Product>, int)> GetFilteredAndSortedProductsAsync(int pageNumber, int pageSize, int? categoryId, string sortName, ProductFilterDto filter);

        /// <summary>
        /// Gets products by page asynchronously.
        /// </summary>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <returns>A task representing the asynchronous operation, with a collection of products and the total count.</returns>
        Task<(IEnumerable<Product>, int)> GetProductsByPageAsync(int pageNumber, int pageSize);

        /// <summary>
        /// Gets a product by its name asynchronously.
        /// </summary>
        /// <param name="name">The name of the product.</param>
        /// <returns>A task representing the asynchronous operation, with the product if found.</returns>
        Task<Product> GetProductByNameAsync(string name);
    }
}
