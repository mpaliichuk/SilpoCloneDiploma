using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OrderServiceApi.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}