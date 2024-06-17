using System.ComponentModel.DataAnnotations;

namespace ProductServiceApi.Models
{
    public class Rating
    {
        [Key]
        public int Id { get; set; } 

        // Значення рейтингу
        [Required(ErrorMessage = "Rating value is required")]
        [Range(1, 5, ErrorMessage = "Rating value must be between 1 and 5")]
        public int Value { get; set; }

        // Коментар до рейтингу
        public string? Comment { get; set; }
        // Зовнішній ключ для зв'язку з продуктом
        [Required(ErrorMessage = "Product is required")]
        public int? IdProduct { get; set; }

        public Product Product { get; set; } // Продукт, до якого належить рейтинг
    }
}
