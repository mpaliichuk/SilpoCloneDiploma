using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;
using FrontEnd.Models.Dto;
using System.Text.Json;
using System.Text;
using FrontEnd.Controllers;
using FrontEnd.Services;
using FrontEnd.Contracts;
using Microsoft.AspNetCore.Mvc.Rendering;

public class AdminController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ProductCategoryRatingService _productCategoryRatingService;

    // Constructor
    public AdminController(ILogger<HomeController> logger, ProductCategoryRatingService productCategoryRatingService)
    {
        _logger = logger;
        _productCategoryRatingService = productCategoryRatingService;
    }

    // Index page
    public IActionResult Index()
    {
        return View();
    }

    // Page for confirming attribute
    [HttpGet]
    public IActionResult ToConfirm()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult ToConfirm(AttributeModel model)
    {
        if (ModelState.IsValid)
        {
            
        }
        return View(model);
    }

    //get product by name

    [HttpGet]
    public async Task<IActionResult> SearchProducts(string searchTitle)
    {
        if (string.IsNullOrEmpty(searchTitle))
        {
            return View(); 
        }

        var product = await _productCategoryRatingService.GetProductByName(searchTitle);

        if (product == null)
        {
            ViewBag.Message = "No product found with that name.";
            return View(product);
        }

        return View(product); 
    }

    /// <summary>
    /// Display a form to add a new attribute
    /// </summary>
    [HttpGet]
    public IActionResult AddAttribute()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult AddAttribute(AttributeModel model)
    {
        if (ModelState.IsValid)
        {
            // Logic for adding an attribute
        }
        return View(model);
    }

    /// <summary>
    /// Display the list of categories
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Category()
    {
        var categories = await _productCategoryRatingService.GetCategoriesAsync();

        if (categories == null || !categories.Any())
        {
            ViewData["Message"] = "Категорії не знайдено.";
        }

        return View(categories);
    }

    /// <summary>
    /// Handle adding or updating a category
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Category(CategoryDto categoryDto)
    {
        if (!ModelState.IsValid)
        {
            foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
            {
                _logger.LogError($"Validation error: {error.ErrorMessage}");
            }
            return View(categoryDto);
        }

        if (categoryDto.Id == null)
        {
            await _productCategoryRatingService.CreateCategoryAsync(categoryDto);
        }
        else
        {
            await _productCategoryRatingService.UpdateCategoryAsync(categoryDto.Id.Value, categoryDto);
            TempData["SuccessMessage"] = "Категорія успішно збережена!";
        }

        return RedirectToAction("Category");
    }



    /// <summary>
    ///  category delete
    /// </summary>
    [HttpDelete("DeleteCategory/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var success = await _productCategoryRatingService.DeleteCategoryAsync(id);
        if (success)
        {
            return Ok(new { message = "Категорія успішно видалена" });
        }
        return BadRequest(new { message = "Помилка при видаленні категорії" });
    }
    /// <summary>
    /// Get
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> AddProduct()
    {
        var categories = await _productCategoryRatingService.GetCategoriesAsync();
        var categorySelectList = categories.Select(c => new SelectListItem
        {
            Value = c.Id.ToString(),
            Text = c.Name
        }).ToList();

        var model = new ProductDto
        {
            CategorySelectList = categorySelectList
        };

        return View(model);
    }


    /// <summary>
    /// Display form to add a new product with a category selection dropdown
    /// </summary>

    [HttpPost]
    public async Task<IActionResult> AddProduct(ProductDto productDto, ICollection<IFormFile> imageFiles)
    {
        if (!productDto.CategoryIdStr.HasValue)
        {
            ModelState.AddModelError("CategoryId", "Категорія повинна бути вибрана.");
        }

        if (imageFiles == null || imageFiles.Count == 0)
        {
            ModelState.AddModelError("imageFiles", "Потрібно завантажити хоча б одне зображення.");
        }

        if (ModelState.IsValid)
        {
            var imageUrls = new List<string>();
            string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploadImg");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            foreach (var file in imageFiles)
            {
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(file.ContentType))
                {
                    ModelState.AddModelError("imageFiles", "Дозволяються лише зображення у форматах JPEG, PNG, GIF.");
                    return View(productDto);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    imageUrls.Add($"/uploadImg/{fileName}");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Помилка при завантаженні файлів: " + ex.Message);
                    return View(productDto);
                }
            }

            var product = new ProductDto
            {
                Title = productDto.Title,
                ProductComposition = productDto.ProductComposition,
                GeneralInformation = productDto.GeneralInformation,
                ImageUrls = imageUrls,
                Availability = productDto.Availability,
                Count = productDto.Count,
                Discount = productDto.Discount,
                Price = productDto.Price,
                CategoryId = (int)productDto.CategoryIdStr
            };

            var createdProduct = await _productCategoryRatingService.CreateProductAsync(product);

            if (createdProduct != null)
            {
                TempData["SuccessMessage"] = "Продукт успішно додано!";
                return RedirectToAction("AddProduct");
            }
            else
            {
                TempData["ErrorMessage"] = "Сталася помилка при додаванні продукту.";
                return RedirectToAction("ProductList");
            }
        }

        return View(productDto);
    }



    // Display general information page
    public IActionResult General()
    {
        return View();
    }

    // Display list of attributes
    public IActionResult ListOfAttributes()
    {
        return View();
    }

    // Display order page
    public IActionResult Order()
    {
        return View();
    }

    /// <summary>
    /// List Shops
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult ListShops()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult ListShops(AttributeModel model)
    {
       
        return View(model);
    }

    /// <summary>
    /// Add Shops
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult AddShop()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult AddShop(AttributeModel model)
    {

        return View(model);
    }

    /// <summary>
    /// Administrators
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult Administrators()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult Administrators(AttributeModel model)
    {

        return View(model);
    }

    /// <summary>
    /// Buyers
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult Buyers()
    {
        var model = new AttributeModel();
        return View(model);
    }

    [HttpPost]
    public IActionResult Buyers(AttributeModel model)
    {

        return View(model);
    }

    /// <summary>
    /// ListOfProducts
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> ListOfProducts(int pageNumber = 1, int pageSize = 10)
    {
        var products = await _productCategoryRatingService.GetProductsWithoutCategoryAsync(pageNumber, pageSize);
        var totalProducts = await _productCategoryRatingService.GetProductsCountAsync();
        var totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);

        var model = new ProductListViewModel
        {
            Products = products,
            CurrentPage = pageNumber,
            TotalPages = totalPages
        };

        return View(model);
    }


    [HttpPost]
    public IActionResult ListOfProducts(AttributeModel model)
    {
        return View(model);
    }



    // Display exit page
    public IActionResult Exit()
    {
        return View();
    }


   


}
