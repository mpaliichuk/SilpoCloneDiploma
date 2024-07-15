
using Microsoft.EntityFrameworkCore;



namespace ProductServiceApi.Models
{
    public class ProductCategoryContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }

        public DbSet<Rating> Ratings { get; set; }

        public DbSet<Product> Products { get; set; }

        public ProductCategoryContext(DbContextOptions<ProductCategoryContext> options)
            : base(options)
        {
            InitializeDatabaseAsync().Wait();
        }

        private async Task InitializeDatabaseAsync() => await Database.EnsureCreatedAsync();

        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                 .HasMany(c => c.Products)
                 .WithOne(p => p.Categorys)
                 .HasForeignKey(p => p.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Categorys)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
            .HasOne(r => r.Product)
             .WithMany(p => p.Ratings)
             .HasForeignKey(r => r.IdProduct)
             .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}

