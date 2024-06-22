using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductServiceApi.Models;

namespace ProductServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   // [Authorize]
    public class RatingController : Controller
    {
        private readonly RatingRepository _service;
        public RatingController(RatingRepository service)
        {
            _service = service;
        }
        // Методи для роботи з рейтингами
        [HttpGet]
        public async Task<IEnumerable<Rating>> GetAllRatings()
        {
            return await _service.GetAllRatings();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rating>> GetRatingById(int id)
        {
            var rating = _service.GetRatingById(id);
            if (rating == null)
            {
                return NotFound();
            }
            return await rating;
        }

        [HttpPost]
        public ActionResult<Rating> AddRating(Rating rating)
        {
            _service.AddRating(rating);
            return CreatedAtAction(nameof(GetRatingById), new { id = rating.Id }, rating);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRating(int id, Rating rating)
        {
            if (id != rating.Id)
            {
                return BadRequest();
            }

            _service.UpdateRating(rating);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRating(int id)
        {
            _service.RemoveRating(id);
            return NoContent();
        }
    }
}
