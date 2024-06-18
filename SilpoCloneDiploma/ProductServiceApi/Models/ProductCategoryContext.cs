
using Microsoft.EntityFrameworkCore;



namespace ProductServiceApi.Models
{
    // Контекст бази даних, що містить таблиці продуктів і категорій
    public class ProductCategoryContext : DbContext
    {
        // Таблиця категорій
        public DbSet<Category> Categories { get; set; }

        // Таблиця оцінок
        public DbSet<Rating> Ratings { get; set; }
        // Таблиця продуктів
        public DbSet<Product> Products { get; set; }

     

        // Конструктор контексту бази даних
        public ProductCategoryContext(DbContextOptions<ProductCategoryContext> options)
            : base(options)
        {
            InitializeDatabaseAsync().Wait();
        }

        // Асинхронний метод для ініціалізації бази даних
        private async Task InitializeDatabaseAsync() => await Database.EnsureCreatedAsync();

        // Асинхронний метод для збереження змін в базі даних
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

        // Налаштування зв'язків між таблицями в базі даних
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                 .HasMany(c => c.Products)
                 .WithOne(p => p.Category)
                 .HasForeignKey(p => p.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
            .HasOne(r => r.Product)
             .WithMany(p => p.Ratings) // Додано, щоб вказати, що у продукта може бути багато рейтингів
             .HasForeignKey(r => r.IdProduct)
             .OnDelete(DeleteBehavior.Cascade);
                //ПІЗНІШЕ ДОДАТИ ЗВ'ЯЗОК З ЮЗЕРОМ(ЗА ПОТРЕБИ)

            base.OnModelCreating(modelBuilder);
        }
    }
}
