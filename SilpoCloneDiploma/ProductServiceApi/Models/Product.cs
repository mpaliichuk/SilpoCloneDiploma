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
        // Опис продукту (необов'язкове поле)
        [StringLength(500, ErrorMessage = "Description length cannot exceed 500 characters")]
        public string? product_Composition { get; set; }
        [StringLength(500, ErrorMessage = "Country length cannot exceed 50 characters")]
        public string? general_Information { get; set; }

        // Масив URL-адрес зображень продукту
        public List<string?> ImageUrls { get; set; }

        // Статус наявності продукту
        [Required(ErrorMessage = "Availability status is required")]
        public Availability Availability { get; set; }
        //Кількість штук
        public int Count {  get; set; }
        // Показник, що вказує, чи є продукт на розпродажу
        public bool? Sale { get; set; }

        // Ціна продукту
        [Required(ErrorMessage = "Price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public double Price { get; set; }

        // Зовнішній ключ для зв'язку з категорією
        [Required(ErrorMessage = "Category is required")]
        
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<Rating> Ratings { get; set; }
    }
}
