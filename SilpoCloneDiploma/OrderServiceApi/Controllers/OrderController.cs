using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderServiceApi.Data;
using OrderServiceApi.Models;
using OrderServiceApi.Models.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OrderServiceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _orderDb;

        public OrdersController(OrderDbContext orderDb)
        {
            _orderDb = orderDb;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _orderDb.Orders
                .Include(o => o.OrderItems)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CustomerId = o.CustomerId,
                    OrderDate = o.OrderDate,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        OrderId = oi.OrderId,
                        ProductId = oi.ProductId,
                        Quantity = oi.Quantity,
                        Price = oi.Price
                    }).ToList(),
                    TotalPrice = o.OrderItems.Sum(oi => (int)(oi.Quantity * oi.Price))
                }).ToListAsync();

            return Ok(orders);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _orderDb.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                OrderDate = order.OrderDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList(),
                TotalPrice = order.OrderItems.Sum(oi => (int)(oi.Quantity * oi.Price))
            };

            return Ok(orderDto);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var order = new Order
            {
                CustomerId = orderDto.CustomerId,
                OrderDate = orderDto.OrderDate,
                OrderItems = orderDto.OrderItems.Select(oi => new OrderItem
                {
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };

            _orderDb.Orders.Add(order);
            await _orderDb.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderDto orderDto)
        {
            if (id != orderDto.Id)
            {
                return BadRequest();
            }

            var order = await _orderDb.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            order.CustomerId = orderDto.CustomerId;
            order.OrderDate = orderDto.OrderDate;

            // Update or add OrderItems
            foreach (var itemDto in orderDto.OrderItems)
            {
                var orderItem = order.OrderItems.FirstOrDefault(oi => oi.Id == itemDto.Id);
                if (orderItem != null)
                {
                    orderItem.ProductId = itemDto.ProductId;
                    orderItem.Quantity = itemDto.Quantity;
                    orderItem.Price = itemDto.Price;
                }
                else
                {
                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = itemDto.ProductId,
                        Quantity = itemDto.Quantity,
                        Price = itemDto.Price
                    });
                }
            }

            // Remove OrderItems not in the DTO
            var itemsToRemove = order.OrderItems
                .Where(oi => !orderDto.OrderItems.Any(dto => dto.Id == oi.Id))
                .ToList();
            _orderDb.OrderItems.RemoveRange(itemsToRemove);

            await _orderDb.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _orderDb.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            _orderDb.OrderItems.RemoveRange(order.OrderItems);
            _orderDb.Orders.Remove(order);
            await _orderDb.SaveChangesAsync();

            return NoContent();
        }
    }
}
