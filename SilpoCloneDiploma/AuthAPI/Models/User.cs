using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AuthAPI.Models
{
    public class User : IdentityUser
    {
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Surname is required")]
        public required string Surname { get; set; }
    }
}
