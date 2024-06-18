using Microsoft.AspNetCore.Mvc;
using PaymentServiceApi.Models;

namespace PaymentServiceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentDbContext _context;

        public PaymentController(PaymentDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
        {
            bool paymentSuccess = await ProcessPaymentAsync(request);

            if (paymentSuccess)
            {
                var payment = new Payment
                {
                    OrderId = request.OrderId,
                    Amount = request.Amount,
                    PaymentMethod = request.PaymentMethod,
                    PaymentDate = DateTime.UtcNow
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Payment successful" });
            }
            else
            {
                return BadRequest(new { Message = "Payment failed" });
            }
        }

        private Task<bool> ProcessPaymentAsync(PaymentRequest request)
        {
            //Add Logic
            return Task.FromResult(true);
        }
    }
}
