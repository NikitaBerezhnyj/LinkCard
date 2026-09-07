using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LinkCard.Migrations
{
    /// <inheritdoc />
    public partial class RenameMediaKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Avatar",
                table: "AspNetUsers",
                newName: "AvatarKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvatarKey",
                table: "AspNetUsers",
                newName: "Avatar");
        }
    }
}
