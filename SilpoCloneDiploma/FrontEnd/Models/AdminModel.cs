using System.ComponentModel.DataAnnotations;

namespace FrontEnd.Models
{
    public class AdminModel
    {
        [Required(ErrorMessage = "ID є обов'язковим.")]
        public string ID { get; set; }

        [Required(ErrorMessage = "Ім'я є обов'язковим.")]
        [StringLength(50, ErrorMessage = "Ім'я не може перевищувати 50 символів.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Прізвище є обов'язковим.")]
        [StringLength(50, ErrorMessage = "Прізвище не може перевищувати 50 символів.")]
        public string Surname { get; set; }

        [Required(ErrorMessage = "Email є обов'язковим.")]
        [EmailAddress(ErrorMessage = "Невірний формат Email.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Номер телефону є обов'язковим.")]
        [Phone(ErrorMessage = "Невірний формат номера телефону.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Роль є обов'язковою.")]
        public string Role { get; set; }
    }
}
