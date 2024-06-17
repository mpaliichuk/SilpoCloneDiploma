using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProductServiceApi.Models; // Це має бути імпорт вашого контексту і моделей
using ProductServiceApi.Contracts; // Інтерфейси і репозиторії

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<ProductCategoryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<RatingRepository>();

// Реєструємо репозиторії та Swagger
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IRatingRepository, RatingRepository>();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Якщо ми в режимі розробки, включаємо Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    });
}

// Редирект HTTPS і налаштування авторизації (якщо потрібно)
app.UseHttpsRedirection();
app.UseAuthorization();

// Мапування контролерів
app.MapControllers();

// Запуск додатку
app.Run();
