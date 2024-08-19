using System.ComponentModel.DataAnnotations;

namespace ProductServiceApi.Dtos
    {
        public class RatingDto
        {
            public int Id { get; set; }

            [Required]
            [Range(1, 5, ErrorMessage = "Rating value must be between 1 and 5")]
            public int Value { get; set; }

            [StringLength(500, ErrorMessage = "Comment length Max 500 characters")]
            public string? Comment { get; set; }

            [Required]
            public int IdProduct { get; set; }
        }
    }


