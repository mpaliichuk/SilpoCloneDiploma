namespace ShippingService.Models
{
    public class Shipping
    {
        public int ShippingId { get; set; }
        public string CustomerName { get; set; }
        public DateTime ShippingDate { get; set; }
        public List<ShippingItem> ShippingItems { get; set; }
    }
}
