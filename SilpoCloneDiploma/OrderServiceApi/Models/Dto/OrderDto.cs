namespace OrderServiceApi.Models.Dto
{
    public class OrderDto
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public DateTime OrderDate { get; set; }

        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
        public int TotalPrice { get; set; }
    }
}
