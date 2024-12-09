using System.ComponentModel.DataAnnotations;

namespace FrontEnd.Models.Dto
{
    public class CategoryDto
    {
        [Key]
        public int? Id { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; }
        public string? IconPath { get; set; }
        public int? ParentCategoryId { get; set; }

    }
}
