using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShippingService.Data;
using ShippingService.Models;

namespace ShippingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        private readonly ShippingDbContext _context;

        public ShippingController(ShippingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shipping>>> GetShippings()
        {
            return await _context.Shippings.Include(s => s.ShippingItems).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Shipping>> GetShipping(int id)
        {
            var shipping = await _context.Shippings.Include(s => s.ShippingItems).FirstOrDefaultAsync(s => s.ShippingId == id);
            if (shipping == null)
            {
                return NotFound();
            }
            return shipping;
        }

        [HttpPost]
        public async Task<ActionResult<Shipping>> CreateShipping(Shipping shipping)
        {
            _context.Shippings.Add(shipping);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetShipping), new { id = shipping.ShippingId }, shipping);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShipping(int id, Shipping shipping)
        {
            if (id != shipping.ShippingId)
            {
                return BadRequest();
            }

            _context.Entry(shipping).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShippingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShipping(int id)
        {
            var shipping = await _context.Shippings.FindAsync(id);
            if (shipping == null)
            {
                return NotFound();
            }

            _context.Shippings.Remove(shipping);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShippingExists(int id)
        {
            return _context.Shippings.Any(e => e.ShippingId == id);
        }
    }
}
