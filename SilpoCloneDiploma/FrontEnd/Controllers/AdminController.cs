using FrontEnd.Models;
using Microsoft.AspNetCore.Mvc;

public class AdminController : Controller
{
    public IActionResult Index()
    {
    return View();
    }

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

    /// <summary>
    /// Edit
    /// </summary>
    /// <returns></returns>
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
            
        }
        return View(model);
    }

    /// <summary>
    /// General information page
    /// </summary>
    /// <returns></returns>
    public IActionResult General()
    {
        return View();
    }

    /// <summary>
    /// Page for the list of stores
    /// </summary>
    /// <returns></returns>
    public IActionResult ListShops()
    {
        
        //var shops = new List<ShopModel>();
        //return View(shops);
        return View();
    }

    /// <summary>
    /// Adding a new store
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult AddShop()
    {
        //var model = new ShopModel();
        //return View(model);
        return View();
    }

    //[HttpPost]
    //public IActionResult AddShop(/*ShopModel model*/)
    //{
    //    if (ModelState.IsValid)
    //    {
    //        // Логіка для додавання магазину
    //    }
    //    return View(model);
    //}

    /// <summary>
    /// Page for administrators
    /// </summary>
    /// <returns></returns>
    public IActionResult Administrators()
    {
        //var administrators = new List<AdministratorModel>();
        //return View(administrators);
        return View();
    }

    /// <summary>
    /// Page for buyers
    /// </summary>
    /// <returns></returns>
    public IActionResult Buyers()
    {
        //var buyers = new List<BuyerModel>();
        //return View(buyers);
        return View();
    }

    /// <summary>
    /// Page for the list of products
    /// </summary>
    /// <returns></returns>
    public IActionResult ListOfProducts()
    {

        //var products = new List<ProductModel>();
        //return View(products);
        return View();
    }

    /// <summary>
    /// Adding a new product
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult AddProduct()
    {
        //var model = new ProductModel();
        //return View(model);
        return View();
    }

    //[HttpPost]
    //public IActionResult AddProduct(ProductModel model)
    //{
    //    if (ModelState.IsValid)
    //    {
    //        
    //    }
    //    return View(model);
    //}

    /// <summary>
    /// Attribute list page
    /// </summary>
    /// <returns></returns>
    public IActionResult ListOfAttributes()
    {

        //var attributes = new List<AttributeModel>();
        //return View(attributes);
        return View();
    }
    /// <summary>
    /// Order
    /// </summary>
    /// <returns></returns>
    public IActionResult Order()
    {

        
        return View();
    }

    /// <summary>
    /// Exit
    /// </summary>
    /// <returns></returns>
    public IActionResult Exit()
    {

        
        return View();
    }
}
