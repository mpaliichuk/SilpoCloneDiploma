    namespace ShopingCartServiceApi.Models.Dto
    {
        public class CartHeaderDto
        {
            public int CartHeaderId { get; set; }
            public string? UserId { get; set; }
            public double TotalPrice { get; set; }
        }
    }
