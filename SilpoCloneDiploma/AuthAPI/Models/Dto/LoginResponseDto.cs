namespace AuthAPI.Models.Dto
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
