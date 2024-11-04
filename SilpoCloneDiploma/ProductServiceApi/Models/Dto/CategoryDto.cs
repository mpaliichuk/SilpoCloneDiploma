using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductServiceApi.Dtos
{
    public class CategoryDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; }

        public int? ParentCategoryId { get; set; }

        public string ParentCategoryName { get; set; }
    }
}
