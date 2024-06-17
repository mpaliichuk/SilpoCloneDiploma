using ProductServiceApi.Models;

namespace ProductServiceApi.Contracts
{
    public interface IRatingRepository
    {
        Task<IEnumerable<Rating>> GetAllRatings();
        Task<Rating> GetRatingById(int id);
        Task AddRating(Rating rating);
        Task UpdateRating(Rating rating);
        Task RemoveRating(int id);
    }
}
