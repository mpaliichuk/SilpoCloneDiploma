using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductServiceApi.Models
{
    public enum Availability
    {
        OutOfStock,
        InStock,
    }

    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Product title is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Title length must be between 1 and 100 characters")]
        public string Title { get; set; }

        [StringLength(500, ErrorMessage = "Description length cannot exceed 500 characters")]
        [JsonPropertyName("productComposition")]
        public string? ProductComposition { get; set; }

        [StringLength(500, ErrorMessage = "General information length cannot exceed 500 characters")]
        public string? GeneralInformation { get; set; }


        public double? Weight { get; set; }

        [StringLength(500, ErrorMessage = "Trade Mark information length cannot exceed 500 characters")]
        public string? TradeMark { get; set; }

        [StringLength(500, ErrorMessage = "Country Of Manufacture information length cannot exceed 500 characters")]
        public string? CountryOfManufacture {  get; set; }

        [JsonPropertyName("imageUrls")]
        public List<string> ImageUrls { get; set; } = new List<string>();

        [Required(ErrorMessage = "Availability status is required")]
        public Availability Availability { get; set; }

        public double Count { get; set; }

        public double? Discount { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public double Price { get; set; }

        [Required(ErrorMessage = "Category id is required")]
        public int CategoryId { get; set; }

        [JsonIgnore]
        public Category? Category { get; set; }

        [JsonIgnore]
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();

        [JsonIgnore]
        public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
    }
}
