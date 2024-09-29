using ShopingCartServiceApi.Models.Dto;

namespace ShopingCartServiceApi.Service.IService
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetProductsAsync();
    }
}
