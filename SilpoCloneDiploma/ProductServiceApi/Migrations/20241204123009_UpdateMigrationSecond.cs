using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductServiceApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMigrationSecond : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sale",
                table: "Products",
                newName: "Discount");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Discount",
                table: "Products",
                newName: "Sale");
        }
    }
}
