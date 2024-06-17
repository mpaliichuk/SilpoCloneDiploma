using Microsoft.EntityFrameworkCore;
using ProductServiceApi.Contracts;

namespace ProductServiceApi.Models
{
    public class RatingRepository : IRatingRepository
    {
        private readonly ProductCategoryContext _context;
        public RatingRepository(ProductCategoryContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task AddRating(Rating rating)
        {
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Rating>> GetAllRatings()
        {
            return await _context.Ratings.ToListAsync();
        }

        public async Task<Rating> GetRatingById(int id)
        {
            return await _context.Ratings.FindAsync(id);
        }

       

        public async Task RemoveRating(int id)
        {
            var rating = await GetRatingById(id);
            if (rating != null)
            {
                _context.Ratings.Remove(rating);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateRating(Rating rating)
        {
            _context.Ratings.Update(rating);
            await _context.SaveChangesAsync();
        }
    }
}
