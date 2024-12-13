    using System.ComponentModel.DataAnnotations;
    using System.Text.Json.Serialization;

    namespace ProductServiceApi.Models
    {
        public class Rating
        {
            [Key]
            public int Id { get; set; } 

        
            [Required(ErrorMessage = "Rating value is required")]
            [Range(1, 5, ErrorMessage = "Rating value must be between 1 and 5")]
            public int Value { get; set; }

            [StringLength(500, ErrorMessage = "Comment length Max 500 characters")]
            public string? Comment { get; set; }
        
            [Required(ErrorMessage = "Product id is required")]
            public int IdProduct { get; set; }

            [JsonIgnore]
            public Product? Product { get; set; } 
        }
    }
