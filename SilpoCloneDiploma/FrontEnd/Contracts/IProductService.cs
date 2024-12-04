using FrontEnd.Models;
using FrontEnd.Models.Dto;

namespace FrontEnd.Contracts
{
    public interface IProductService
    {
        ProductDto GetProductByName(string searchTitle);
    }
}
