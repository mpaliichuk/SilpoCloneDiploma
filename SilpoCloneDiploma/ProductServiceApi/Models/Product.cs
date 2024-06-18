using System.ComponentModel.DataAnnotations;

namespace ProductServiceApi.Models
{
    // Перерахування для статусу доступності продукту
    public enum Availability
    {
        InStock,     // В наявності
        OutOfStock,  // Немає в наявності
    }
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Product title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title length must be between 3 and 100 characters")]
        public string Title { get; set; }

        // Опис продукту
        [StringLength(500, ErrorMessage = "Description length cannot exceed 500 characters")]
        public string? Description { get; set; }

        //Product Info
        [StringLength(50, ErrorMessage = "Country length cannot exceed 50 characters")]
        public string? Country { get; set; }
        [Range(1, 1000, ErrorMessage = "Quantity must be a positive number and less than 1000 units")]
        public int? Quantity {  get; set; }
        [StringLength(50, ErrorMessage = "Trademark length cannot exceed 50 characters")]
        public string? Trademark { get; set; }
        [StringLength(50, ErrorMessage = "Taste length cannot exceed 50 characters")]
        public string? Taste { get; set; }
        [StringLength(30, ErrorMessage = "Color length cannot exceed 30 characters")]
        public string? Color { get; set; }
        [Range(1, 100, ErrorMessage = "AlcoholContent value must be a positive number and less than 100 units")]
        public double? AlcoholContent { get; set; }
        [Range(1, 1000000, ErrorMessage = "Volume value must be a positive number and less than 1000000 units")]
        public double? Volume { get; set; }
        //
        // Add more....!!!
        //

        //Nutritional value per 100 g
        [Range(0, 100, ErrorMessage = "Proteins must be a positive number and less than 1000 units")]
        public double? Proteins { get; set; }
        [Range(0, 100, ErrorMessage = "Fats must be a positive number and less than 1000 units")]
        public double? Fats { get; set; }
        [Range(0, 100, ErrorMessage = "Carbohydrates must be a positive number and less than 1000 units")]
        public double? Carbohydrates { get; set; }

        // URL-адреса зображення продукту (необов'язкове поле)
        public string? ImageUrl { get; set; }

        // Статус наявності продукту
        [Required(ErrorMessage = "Availability status is required")]
        public Availability Availability { get; set; }

        // Показник, що вказує, чи є продукт на розпродажу
        public bool? Sale { get; set; }
        [Range(5, 99, ErrorMessage = "Discount must be a positive number and less than 100 units and greater than 5")]
        public int? Discount {  get; set; }

        // Ціна продукту
        [Required(ErrorMessage = "Price is required")]
        [Range(0.5, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public double Price { get; set; }

        // Зовнішній ключ для зв'язку з категорією
        [Required(ErrorMessage = "Category is required")]
        
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<Rating> Ratings { get; set; }
    }
}
