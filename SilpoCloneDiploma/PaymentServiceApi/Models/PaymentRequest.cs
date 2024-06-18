namespace PaymentServiceApi.Models
{
    public class PaymentRequest
    {
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string Cvc { get; set; }
    }
}
