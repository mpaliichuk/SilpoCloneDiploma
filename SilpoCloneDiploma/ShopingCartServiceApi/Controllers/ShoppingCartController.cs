using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopingCartServiceApi.Data;
using ShopingCartServiceApi.Models;
using ShopingCartServiceApi.Models.Dto;
using ShopingCartServiceApi.Service.IService;

namespace ShopingCartServiceApi.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private IMapper maper;
        private readonly IProductService _productService;
        private readonly AppDBContext _context;

        public ShoppingCartController(AppDBContext context, IMapper mapper, IProductService productService)
        {
            maper = mapper;
            _context = context;
            _productService = productService;
        }

        [HttpGet("get-cart/{userId}")]
        public async Task<ResponseDto> GetCart(string userId)
        {
            var response = new ResponseDto();
            try
            {
                CartDto cart = new()
                {
                    CartHeader = maper.Map<CartHeaderDto>(await _context.CartHeaders.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId)),
                };
                cart.CartDetails = maper.Map<List<CartDetailsDto>>(
                    await _context.CartDetails.AsNoTracking().Where(x => x.CartHeaderId == cart.CartHeader.CartHeaderId).ToListAsync());

                var products = await _productService.GetProductsAsync();
                foreach (var cartDetails in cart.CartDetails)
                {
                    cartDetails.Product = products.FirstOrDefault(x => x.Id == cartDetails.ProductId);
                    if (cartDetails.Product == null)
                    {
                        continue;
                    }
                    cart.CartHeader.TotalPrice += cartDetails.Product.Price * cartDetails.Count;
                }
                cart.CartDetails = cart.CartDetails.Where(x => x.Product != null).ToList();


                response.Result = cart;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.IsSuccess = false;
            }
            response.IsSuccess = true;

            return response;
        }

        [HttpPost("upsert")]
        public async Task<ResponseDto> Upsert(CartDto cartDto)
        {
            var response = new ResponseDto();
            try
            {
                var cartHeader = await _context.CartHeaders.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == cartDto.CartHeader.UserId);
                if (cartHeader == null)
                {
                    CartHeader carHeaderFromDto = maper.Map<CartHeader>(cartDto.CartHeader);
                    _context.CartHeaders.Add(carHeaderFromDto);
                    await _context.SaveChangesAsync();
                    cartDto.CartDetails.First().CartHeaderId = carHeaderFromDto.CartHeaderId;
                    _context.CartDetails.Add(maper.Map<CartDetails>(cartDto.CartDetails.First()));
                    await _context.SaveChangesAsync();
                }
                else
                {
                    foreach (var cartDetails in cartDto.CartDetails)
                    {
                        var cartDetailsFromDb = await _context.CartDetails.AsNoTracking().FirstOrDefaultAsync(
                                                       u => u.ProductId == cartDetails.ProductId
                                                       && u.CartHeaderId == cartHeader.CartHeaderId);
                        if (cartDetailsFromDb == null)
                        {
                            cartDetails.CartHeaderId = cartHeader.CartHeaderId;
                            _context.CartDetails.Add(maper.Map<CartDetails>(cartDetails));
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            cartDetailsFromDb.Count += cartDetails.Count;
                            cartDetailsFromDb.CartHeaderId = cartDetailsFromDb.CartHeaderId;
                            cartDetailsFromDb.CartDetailsId = cartDetailsFromDb.CartDetailsId;
                            _context.CartDetails.Update(maper.Map<CartDetails>(cartDetailsFromDb));
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                response.Result = cartDto;
                response.IsSuccess = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.IsSuccess = false;
            }
            return response;
        }

        [HttpPost("remove-details/{cartDetailsId}")]
        public async Task<ResponseDto> RemoveDetails(int cartDetailsId)
        {
            var response = new ResponseDto();
            try
            {
                var cartDetails = await _context.CartDetails.FirstOrDefaultAsync(x => x.CartDetailsId == cartDetailsId);
                if (cartDetails == null)
                {
                    response.IsSuccess = false;
                    response.Message = "Invalid CartDetailsId";
                    return response;
                }
                _context.CartDetails.Remove(cartDetails);
                await _context.SaveChangesAsync();
                response.IsSuccess = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.IsSuccess = false;
            }
            return response;
        }


        [HttpDelete("remove-cart/{userId}")]
        public async Task<ResponseDto> RemoveCart(string userId)
        {
            var response = new ResponseDto();
            try
            {
                var cartHeader = await _context.CartHeaders.FirstOrDefaultAsync(x => x.UserId == userId);
                if (cartHeader == null)
                {
                    response.IsSuccess = false;
                    response.Message = "Invalid UserId";
                    return response;
                }
                var cartDetails = await _context.CartDetails.Where(x => x.CartHeaderId == cartHeader.CartHeaderId).ToListAsync();
                _context.CartDetails.RemoveRange(cartDetails);
                _context.CartHeaders.Remove(cartHeader);
                await _context.SaveChangesAsync();
                response.IsSuccess = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.IsSuccess = false;
            }
            return response;
        }


    }
}
