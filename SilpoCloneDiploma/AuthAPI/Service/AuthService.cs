using AuthAPI.Data;
using AuthAPI.Models;
using AuthAPI.Models.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AuthAPI.Service
{
    public class AuthService : IAuthService
    {
        private readonly AuthDBContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(AuthDBContext context,
                           UserManager<User> userManager,
                           RoleManager<IdentityRole> roleManager,
                           IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<ResponseDto> AssignRole(AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByEmailAsync(assignRoleDto.Email);
            if (user == null)
            {
                return new ResponseDto
                {
                    IsSuccess = false,
                    Message = "User not found"
                };
            }
            var role = await _roleManager.FindByNameAsync(assignRoleDto.Role);
            if (role == null)
            {
                return new ResponseDto
                {
                    IsSuccess = false,
                    Message = "Role not found"
                };

            }

            var result = await _userManager.AddToRoleAsync(user, role.Name);
            return new ResponseDto
            {
                IsSuccess = result.Succeeded,
                Message = result.Succeeded ? "Role assigned successfully" : result.Errors.Select(e => e.Description).FirstOrDefault()
            };
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
        {
            var user = await _userManager.FindByEmailAsync(loginRequestDto.Email);
            if (user == null)
            {
                return new LoginResponseDto
                {
                    User = null,
                    IsSuccess = false,
                    Message = "User not found"
                };
            }
            var isValid = await _userManager.CheckPasswordAsync(user, loginRequestDto.Password);

            if(isValid)
            {
                return new LoginResponseDto
                {
                    User = new UserDto
                    {
                        ID = user.Id,
                        Name = user.Name,
                        Surname = user.Surname,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
                    },
                    IsSuccess = true,
                    Message = "Login successful",
                    Token = await _jwtTokenGenerator.GenerateTokenAsync(user)
                };
            }

            return new LoginResponseDto
            {
                User = null,
                IsSuccess = false,
                Message = "Invalid password"
            };
        }

        public async Task<ResponseDto> Register(RegistrationRequestDto registrationRequestDto)
        {
            User user = new User
            {
                UserName = registrationRequestDto.Email,
                Email = registrationRequestDto.Email,
                NormalizedEmail = registrationRequestDto.Email.ToUpper(),
                Name = registrationRequestDto.Name,
                Surname = registrationRequestDto.Surname,
                PhoneNumber = registrationRequestDto.PhoneNumber,
            };

            try
            {
                IdentityResult result = await _userManager.CreateAsync(user, registrationRequestDto.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Customer");
                    return new ResponseDto
                    {
                        IsSuccess = true,
                        Message = "User registration successful"
                    };
                }
                else
                {
                    return new ResponseDto
                    {
                        IsSuccess = false,
                        Message = result.Errors.Select(e => e.Description).FirstOrDefault()
                    };
                }
            }
            catch (Exception ex)
            {
                return new ResponseDto
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }
    }
}
