using FrontEnd.Models.Dto;

namespace FrontEnd.Models
{
    public class ProductResponse
    {
            public IEnumerable<ProductDto> Products { get; set; }
            public int TotalCount { get; set; }       
    }
}
