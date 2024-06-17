using Microsoft.AspNetCore.Mvc;

namespace ProductServiceApi.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
