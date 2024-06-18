namespace PaymentServiceApi.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
