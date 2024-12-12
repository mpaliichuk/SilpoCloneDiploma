using FrontEnd.Models.Dto;
using Newtonsoft.Json;
using System.Text;

namespace FrontEnd.Contracts
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly HttpClient _httpClient;

        public ShoppingCartService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ResponseDto> GetCartAsync(string userId)
        {
            var response = await _httpClient.GetAsync($"/gateway/GetUserCart/{userId}");
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<ResponseDto>(result);
            }
            return new ResponseDto { IsSuccess = false, Message = "Failed to fetch cart" };
        }

        public async Task<ResponseDto> UpsertCartAsync(CartDto cartDto)
        {
            var content = new StringContent(JsonConvert.SerializeObject(cartDto), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/gateway/AddToCart", content);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<ResponseDto>(result);
            }

            return new ResponseDto { IsSuccess = false, Message = "Failed to update cart" };
        }

        public async Task<ResponseDto> RemoveCartAsync(string userId)
        {
            var response = await _httpClient.PostAsync($"/gateway/RemoveCart/{userId}", null);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<ResponseDto>(result);
            }
            return new ResponseDto { IsSuccess = false, Message = "Failed to remove cart" };
        }

        public async Task<ResponseDto> RemoveCartDetailsAsync(int cartDetailsId)
        {
            var response = await _httpClient.PostAsync($"/gateway/RemoveCartDetails/{cartDetailsId}", null);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<ResponseDto>(result);
            }
            return new ResponseDto { IsSuccess = false, Message = "Failed to remove cart details" };
        }
    }
}
