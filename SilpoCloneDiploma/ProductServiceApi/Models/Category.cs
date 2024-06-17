using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductServiceApi.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        // Назва категорії
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Category name length must be between 3 and 50 characters")]
        public string Name { get; set; }

        // Навігаційна властивість для зв'язку з продуктами
        [JsonIgnore]
        public ICollection<Product> Products { get; set; }

        // Nullable for root categories
        public int? ParentCategoryId { get; set; }
        // Navigation property for parent category
        [JsonIgnore]
        public Category ParentCategory { get; set; }
        // Navigation property for subcategories
        [JsonIgnore]
        public ICollection<Category> Subcategories { get; set; }
    }
}
