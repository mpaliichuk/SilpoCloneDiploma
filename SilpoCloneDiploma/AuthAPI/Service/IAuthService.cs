using AuthAPI.Models.Dto;

namespace AuthAPI.Service
{
    public interface IAuthService
    {
        Task<ResponseDto> Register(RegistrationRequestDto registrationRequestDto);
        Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto);
        Task<ResponseDto> AssignRole(AssignRoleDto assignRoleDto);
    }
}
