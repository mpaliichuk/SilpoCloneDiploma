
using AuthAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthAPI.Service
{
    public interface IJwtTokenGenerator
    {
        public Task<string> GenerateTokenAsync(User user);
    }
}
