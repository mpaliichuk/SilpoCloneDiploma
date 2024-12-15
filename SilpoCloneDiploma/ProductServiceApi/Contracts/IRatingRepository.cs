using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    /// <summary>
    /// Interface for managing rating data.
    /// </summary>
    public interface IRatingRepository
    {
        /// <summary>
        /// Gets all ratings asynchronously.
        /// </summary>
        /// <returns>A task representing the asynchronous operation, with a collection of ratings.</returns>
        Task<IEnumerable<Rating>> GetAllRatingsAsync();

        /// <summary>
        /// Gets a rating by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the rating.</param>
        /// <returns>A task representing the asynchronous operation, with the rating if found.</returns>
        Task<Rating> GetRatingByIdAsync(int id);

        /// <summary>
        /// Adds a new rating asynchronously.
        /// </summary>
        /// <param name="rating">The rating to add.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddRatingAsync(Rating rating);

        /// <summary>
        /// Updates an existing rating asynchronously.
        /// </summary>
        /// <param name="rating">The rating with updated information.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateRatingAsync(Rating rating);

        /// <summary>
        /// Removes a rating by its identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the rating to remove.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task RemoveRatingAsync(int id);
    }
}
