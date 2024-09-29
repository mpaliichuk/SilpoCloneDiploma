using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Contracts
{
    public interface IRatingRepository
    {
        Task<IEnumerable<Rating>> GetAllRatingsAsync(); 
        Task<Rating> GetRatingByIdAsync(int id); 
        Task AddRatingAsync(Rating rating); 
        Task UpdateRatingAsync(Rating rating); 
        Task RemoveRatingAsync(int id); 
    }
}
