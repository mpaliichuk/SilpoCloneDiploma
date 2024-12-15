using ProductServiceApi.Models;

namespace ProductServiceApi.Contracts
{
    /// <summary>
    /// Interface for managing category data.
    /// </summary>
    public interface ICategoryRepository
    {
        /// <summary>
        /// Gets all categories asynchronously.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, with a collection of categories.</returns>
        Task<IEnumerable<Category>> GetAllCategoriesAsync();

        /// <summary>
        /// Gets a category by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the category.</param>
        /// <returns>A task representing the asynchronous operation, with the category if found.</returns>
        Task<Category> GetCategoryByIdAsync(int id);

        /// <summary>
        /// Gets a category by its name asynchronously.
        /// </summary>
        /// <param name="name">The name of the category.</param>
        /// <returns>A task representing the asynchronous operation, with the category if found.</returns>
        Task<Category> GetCategoryByNameAsync(string name);

        /// <summary>
        /// Adds a new category asynchronously.
        /// </summary>
        /// <param name="category">The category to add.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddCategoryAsync(Category category);

        /// <summary>
        /// Updates an existing category asynchronously.
        /// </summary>
        /// <param name="category">The category with updated information.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateCategoryAsync(Category category);

        /// <summary>
        /// Removes a category by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the category to remove.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveCategoryAsync(int id);
    }
}
