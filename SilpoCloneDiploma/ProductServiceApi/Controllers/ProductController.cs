using Microsoft.AspNetCore.Mvc;

namespace ProductServiceApi.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
