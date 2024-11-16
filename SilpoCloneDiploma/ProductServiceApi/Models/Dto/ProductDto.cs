using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace ProductServiceApi.Dtos
{
    public enum Availability
    {
        OutOfStock,
        InStock,
    }
    public class ProductDto
        {
            [Required]
            public int Id { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 1)]
            public string Title { get; set; }

            [StringLength(500)]
            [JsonPropertyName("productComposition")]
            public string? ProductComposition { get; set; }

            [StringLength(500)]
            public string? GeneralInformation { get; set; }

            [JsonPropertyName("imageUrls")]
            public List<string> ImageUrls { get; set; } = new List<string>();

            [Required]
            public Availability Availability { get; set; }

            public double Count { get; set; }

            public double? Sale { get; set; }

            [Required]
            [Range(0, double.MaxValue)]
            public double Price { get; set; }

            public int CategoryId { get; set; }
        }
}



