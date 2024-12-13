using FrontEnd.Contracts;
using FrontEnd.Services;
using Microsoft.Extensions.Logging;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();


// Add HttpClient configuration for ProductCategoryRatingService
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHttpClient<ProductCategoryRatingService>(client =>
    {
        client.BaseAddress = new Uri("https://localhost:5296");
    })
    .ConfigurePrimaryHttpMessageHandler(() =>
        new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
        });


}
else
{
    builder.Services.AddHttpClient<ProductCategoryRatingService>(client =>
    {
        client.BaseAddress = new Uri("https://localhost:5296");
    });
}

builder.Services.AddHttpClient<IShoppingCartService, ShoppingCartService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5000");
});

// Register ProductCategoryRatingService
builder.Services.AddScoped<ProductCategoryRatingService>();

//Culture
var cultureInfo = new CultureInfo("uk-UA");
CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler("/Home/Error");
app.UseHsts();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.UseStatusCodePagesWithReExecute("/Home/Error/{0}");

// Map default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Goodmeal}/{id?}");

app.Run();
