    using Microsoft.EntityFrameworkCore;
    using ShopingCartServiceApi.Models;

    namespace ShopingCartServiceApi.Data
    {
        public class AppDBContext : DbContext
        {
            public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
            {
            }

            public DbSet<CartHeader> CartHeaders { get; set; }
            public DbSet<CartDetails> CartDetails { get; set; }

        }
    }
