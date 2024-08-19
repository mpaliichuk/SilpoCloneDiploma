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
    public IActionResult EditAttribute()
    {
        var model = new AttributeModel(); 
        return View(model);
    }

    [HttpPost]
    public IActionResult EditAttribute(AttributeModel model)
    {
        if (ModelState.IsValid)
        {
            
        }
        return View(model);
    }
}
