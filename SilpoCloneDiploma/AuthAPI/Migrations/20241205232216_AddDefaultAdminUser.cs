using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Security.Cryptography;
using System.Text;

#nullable disable

namespace AuthAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var hasher = new PasswordHasher<IdentityUser>();
            var hashedPassword = hasher.HashPassword(null, "admin");

            // Insert default admin user
            migrationBuilder.Sql($@"
                INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
                VALUES (NEWID(), 'admin', 'ADMIN', 'admin@example.com', 'ADMIN@EXAMPLE.COM', 0, '{hashedPassword}', NEWID(), NEWID(), 0, 0, 0, 0)
            ");

            // Insert admin role if it doesn't exist
            migrationBuilder.Sql($@"
                IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = 'ADMIN')
                BEGIN
                    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
                    VALUES (NEWID(), 'Admin', 'ADMIN', NEWID())
                END
            ");

            // Assign admin role to the user
            migrationBuilder.Sql($@"
                DECLARE @UserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE UserName = 'admin');
                DECLARE @RoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN');
                INSERT INTO AspNetUserRoles (UserId, RoleId)
                VALUES (@UserId, @RoleId)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM AspNetUserRoles WHERE UserId = (SELECT Id FROM AspNetUsers WHERE UserName = 'admin')");
            migrationBuilder.Sql("DELETE FROM AspNetUsers WHERE UserName = 'admin'");
        }
    }
}