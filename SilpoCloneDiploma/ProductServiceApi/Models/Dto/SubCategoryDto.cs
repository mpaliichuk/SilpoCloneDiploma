using System.ComponentModel.DataAnnotations;

namespace ProductServiceApi.Dtos
{
    public class SubCategoryDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
        public int? Count { get; set; }
    }
}
