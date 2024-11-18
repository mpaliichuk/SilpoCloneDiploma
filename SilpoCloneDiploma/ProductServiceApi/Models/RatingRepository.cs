using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Models
{
    public class RatingRepository : IRatingRepository
    {
        private readonly ProductCategoryContext _context;
        private readonly ILogger<RatingRepository> _logger;

        public RatingRepository(ProductCategoryContext context, ILogger<RatingRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task AddRatingAsync(Rating rating) 
        {
            if (rating == null)
            {
                _logger.LogWarning("Attempted to add a null rating");
                throw new ArgumentNullException(nameof(rating));
            }

            try
            {
                _context.Ratings.Add(rating);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Rating added successfully: {@Rating}", rating);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while adding rating to database");
                throw new Exception("Error occurred while adding rating to database", ex);
            }
        }

        public async Task<IEnumerable<Rating>> GetAllRatingsAsync() 
        {
            try
            {
                return await _context.Ratings.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all ratings");
                throw new Exception("Error occurred while retrieving all ratings", ex);
            }
        }

        public async Task<Rating> GetRatingByIdAsync(int id) 
        {
            try
            {
                return await _context.Ratings.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving rating with ID {id}");
                throw new Exception($"Error occurred while retrieving rating with ID {id}", ex);
            }
        }

        public async Task RemoveRatingAsync(int id) 
        {
            var rating = await GetRatingByIdAsync(id);
            if (rating != null)
            {
                try
                {
                    _context.Ratings.Remove(rating);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Rating removed successfully: {@Rating}", rating);
                }
                catch (DbUpdateException ex)
                {
                    _logger.LogError(ex, $"Error occurred while removing rating with ID {id}");
                    throw new Exception($"Error occurred while removing rating with ID {id}", ex);
                }
            }
            else
            {
                var ex = new ArgumentException($"Rating with ID {id} not found");
                _logger.LogError(ex, ex.Message);
                throw ex;
            }
        }

        public async Task UpdateRatingAsync(Rating rating) 
        {
            if (rating == null)
            {
                _logger.LogWarning("Attempted to update a null rating");
                throw new ArgumentNullException(nameof(rating));
            }

            try
            {
                _context.Ratings.Update(rating);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Rating updated successfully: {@Rating}", rating);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error occurred while updating rating in database");
                throw new Exception("Error occurred while updating rating in database", ex);
            }
        }
    }
}
