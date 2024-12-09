using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FrontEnd.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        public IActionResult Goodmeal()
        {
            return View();
        }

        [Route("Goodmeal/ProductPage/{id}")]
        public IActionResult ProductPage(string id)
        {
            var productId = id;
            ViewBag.ProductId = productId;
            return View();
        }

        [Route("Goodmeal/Category/{id}")]
        public IActionResult CategoryPage(string id)
        {
            var categoryId = id;
            ViewBag.CategoryId = categoryId;
            return View("CategoryPage");
        }

        [Route("Goodmeal/Category/{id}/{sortName}")]
        public IActionResult SortedCategoryPage(string id, string sortName)
        {
            var categoryId = id;
            ViewBag.CategoryId = categoryId;
            var sortMode = sortName;
            ViewBag.SortMode = sortMode;
            return View("CategoryPage");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /// <summary>
        /// Error page
        /// </summary>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        [Route("Home/Error/{statusCode}")]
        public IActionResult Error(int statusCode)
        {
            ViewBag.StatusCode = statusCode;
            return View("Error");
        }
    }
}
