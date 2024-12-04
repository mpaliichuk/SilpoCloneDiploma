using FrontEnd.Services;
using FrontEnd.Models.Dto;
namespace FrontEnd.Models
{
    public class ProductListViewModel
    {
        public List<ProductDto> Products { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
       
    }
}
