using FrontEnd.Models.Dto;

namespace FrontEnd.Contracts
{
    public interface IShoppingCartService
    {
        Task<ResponseDto> GetCartAsync(string userId);
        Task<ResponseDto> UpsertCartAsync(CartDto cartDto);
        Task<ResponseDto> RemoveCartAsync(string userId);
        Task<ResponseDto> RemoveCartDetailsAsync(int cartDetailsId);
    }
}
