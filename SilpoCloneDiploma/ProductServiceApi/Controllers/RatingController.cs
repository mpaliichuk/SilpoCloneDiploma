using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RatingController : Controller
    {
        private readonly IRatingRepository _service;
        private readonly ILogger<RatingController> _logger;

        public RatingController(IRatingRepository service, ILogger<RatingController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets all ratings.
        /// </summary>
        
        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<Rating>> GetAllRatings()
        {
            return await _service.GetAllRatings();
        }

        /// <summary>
        /// Gets a rating by ID.
        /// </summary>
        /// <param name="id">The ID of the rating.</param>
        
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Rating>> GetRatingById(int id)
        {
            try
            {
                var rating = await _service.GetRatingById(id);
                if (rating == null)
                {
                    return NotFound();
                }
                return rating;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving rating with ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Adds a new rating.
        /// </summary>
        /// <param name="rating">The rating to add.</param>
       
        [HttpPost]
        [Authorize(Roles = "Administrator")]

        public async Task<ActionResult<Rating>> AddRating(Rating rating)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _service.AddRating(rating);
                return CreatedAtAction(nameof(GetRatingById), new { id = rating.Id }, rating);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding rating");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Updates an existing rating.
        /// </summary>
        /// <param name="id">The ID of the rating to update.</param>
        /// <param name="rating">The updated rating.</param>
       
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> UpdateRating(int id, [FromBody] Rating rating)
        {
            if (id != rating.Id)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _service.UpdateRating(rating);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating rating with ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Deletes a rating.
        /// </summary>
        /// <param name="id">The ID of the rating to delete.</param>
       
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> DeleteRating(int id)
        {
            try
            {
                await _service.RemoveRating(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting rating with ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
