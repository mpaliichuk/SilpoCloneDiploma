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
       
        public ICollection<Product> Products { get; set; }
    }
}
