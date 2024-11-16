namespace FrontEnd.Models.Dto
{
    public class ProductCategoryDto
    {
        public int ProductId { get; set; }
        public ProductDto Product { get; set; }

        public int CategoryId { get; set; }
        public CategoryDto Category { get; set; }
    }
}
