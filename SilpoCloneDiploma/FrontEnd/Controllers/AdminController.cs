using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;
using FrontEnd.Models.Dto;
using System.Text.Json;
using System.Text;
using FrontEnd.Controllers;
using FrontEnd.Services;
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
            // Logic for confirming the attribute
        }
        return View(model);
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

        // Перевірка на null або порожність категорій
        if (categories == null || !categories.Any())
        {
            ViewData["Message"] = "Категорії не знайдено.";
        }

        // Передача категорій у модель
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
    /// Handle category deletion
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        await _productCategoryRatingService.DeleteCategoryAsync(id);
        return RedirectToAction("CategoryManagement");
    }

    /// <summary>
    /// Display form to add a new product with a category selection dropdown
    /// </summary>
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

        ViewData["CategorySelectList"] = categorySelectList;
        return View(model);
    }

    /// <summary>
    /// Add a new product and upload images
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddProduct(ProductDto productDto, ICollection<IFormFile> imageFiles)
    {
        if (ModelState.IsValid)
        {
            var imageUrls = new List<string>();
            if (imageFiles != null && imageFiles.Count > 0)
            {
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
                        ModelState.AddModelError("imageFiles", "Only image files are allowed.");
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
                        imageUrls.Add($"/uploads/{fileName}");
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("", "An error occurred while uploading files: " + ex.Message);
                        return View(productDto);
                    }
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
                Sale = productDto.Sale,
                Price = productDto.Price,
                CategoryId = productDto.CategoryId
            };

            var ocelotApiUrl = "http://localhost:5000/api/products";

            using (var client = new HttpClient())
            {
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(product.Title), "Title");
                content.Add(new StringContent(product.ProductComposition), "ProductComposition");
                content.Add(new StringContent(product.GeneralInformation), "GeneralInformation");
                content.Add(new StringContent(product.Availability.ToString()), "Availability");
                content.Add(new StringContent(product.Count.ToString()), "Count");
                content.Add(new StringContent(product.Sale?.ToString() ?? "0"), "Sale");
                content.Add(new StringContent(product.Price.ToString()), "Price");
                content.Add(new StringContent(product.CategoryId.ToString()), "CategoryId");

                foreach (var imageUrl in imageUrls)
                {
                    var imageContent = new ByteArrayContent(System.IO.File.ReadAllBytes(imageUrl));
                    content.Add(imageContent, "imageFiles", Path.GetFileName(imageUrl));
                }

                var response = await client.PostAsync(ocelotApiUrl, content);
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("ProductList");
                }
                else
                {
                    ModelState.AddModelError("", "Error while sending data to the service.");
                    return View(productDto);
                }
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

    // Display exit page
    public IActionResult Exit()
    {
        return View();
    }
}
