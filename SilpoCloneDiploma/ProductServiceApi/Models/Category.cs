using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductServiceApi.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Category name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Category name length must be between 2 and 50 characters")]
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<Product>? Products { get; set; }

    }
}
