
using AuthAPI.Models;

namespace AuthAPI.Service
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
