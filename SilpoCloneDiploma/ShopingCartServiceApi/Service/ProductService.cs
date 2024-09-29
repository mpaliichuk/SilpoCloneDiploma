using Newtonsoft.Json;
using ShopingCartServiceApi.Models.Dto;
using ShopingCartServiceApi.Service.IService;

namespace ShopingCartServiceApi.Service
{
    public class ProductService : IProductService
    {
        private readonly IHttpClientFactory _clientFactory;

        public ProductService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsAsync()
        {
            var client = _clientFactory.CreateClient("Product");
            var response = await client.GetAsync($"api/product");
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<ProductDto>>(Convert.ToString(content));
        }
    }
}
