namespace ShippingService.Models
{
    public class ShippingItem
    {
        public int ShippingItemId { get; set; }
        public int ShippingId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
