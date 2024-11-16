using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProductServiceApi.Contracts;
using ProductServiceApi.Dtos;
using ProductServiceApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class RatingController : ControllerBase
    {
        private readonly IRatingRepository _service;
        private readonly ILogger<RatingController> _logger;

        public RatingController(IRatingRepository service, ILogger<RatingController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Get all ratings.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<RatingDto>))]
        public async Task<ActionResult<IEnumerable<RatingDto>>> GetAllRatings()
        {
            try
            {
                var ratings = await _service.GetAllRatingsAsync();
                var ratingDtos = ratings.Select(r => new RatingDto
                {
                    Id = r.Id,
                    Value = r.Value,
                    Comment = r.Comment,
                    IdProduct = r.IdProduct
                });
                return Ok(ratingDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all ratings");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        /// <summary>
        /// Get a rating by ID.
        /// </summary>
        /// <param name="id">The ID of the rating.</param>
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RatingDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RatingDto>> GetRatingById(int id)
        {
            try
            {
                var rating = await _service.GetRatingByIdAsync(id);
                if (rating == null)
                {
                    return NotFound();
                }
                var ratingDto = new RatingDto
                {
                    Id = rating.Id,
                    Value = rating.Value,
                    Comment = rating.Comment,
                    IdProduct = rating.IdProduct
                };
                return Ok(ratingDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving rating with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        /// <summary>
        /// Add a new rating.
        /// </summary>
        /// <param name="ratingDto">The rating to add.</param>
        [HttpPost]
        //[Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RatingDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RatingDto>> AddRating([FromBody] RatingDto ratingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var rating = new Rating
                {
                    Value = ratingDto.Value,
                    Comment = ratingDto.Comment,
                    IdProduct = ratingDto.IdProduct
                };
                await _service.AddRatingAsync(rating);
                _logger.LogInformation("Rating added successfully: {@Rating}", rating);

                var createdRatingDto = new RatingDto
                {
                    Id = rating.Id,
                    Value = rating.Value,
                    Comment = rating.Comment,
                    IdProduct = rating.IdProduct
                };

                return CreatedAtAction(nameof(GetRatingById), new { id = createdRatingDto.Id }, createdRatingDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding rating");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        /// <summary>
        /// Update an existing rating.
        /// </summary>
        /// <param name="id">The ID of the rating to update.</param>
        /// <param name="ratingDto">The updated rating.</param>
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRating(int id, [FromBody] RatingDto ratingDto)
        {
            if (id != ratingDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingRating = await _service.GetRatingByIdAsync(id);
                if (existingRating == null)
                {
                    return NotFound();
                }

                existingRating.Value = ratingDto.Value;
                existingRating.Comment = ratingDto.Comment;
                existingRating.IdProduct = ratingDto.IdProduct;

                await _service.UpdateRatingAsync(existingRating);
                _logger.LogInformation("Rating updated successfully: {@Rating}", existingRating);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating rating with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a rating.
        /// </summary>
        /// <param name="id">The ID of the rating to delete.</param>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRating(int id)
        {
            try
            {
                var existingRating = await _service.GetRatingByIdAsync(id);
                if (existingRating == null)
                {
                    return NotFound();
                }

                await _service.RemoveRatingAsync(id);
                _logger.LogInformation("Rating removed successfully: ID {RatingId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting rating with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }
    }
}
