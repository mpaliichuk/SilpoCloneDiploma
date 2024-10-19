using System.Text.Json.Serialization;

namespace ShopingCartServiceApi.Models.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        [JsonPropertyName("productComposition")]
        public string? ProductComposition { get; set; }

        [JsonPropertyName("imageUrls")]
        public List<string> ImageUrls { get; set; } = new List<string>();

        public double Price { get; set; }

        public bool? Sale { get; set; }

        public int Count { get; set; }

        public int CategoryId { get; set; }
    }
}