using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCompanies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserCompanyId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCompanies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserCompanyId",
                table: "Users",
                column: "UserCompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserCompanies_UserCompanyId",
                table: "Users",
                column: "UserCompanyId",
                principalTable: "UserCompanies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserCompanies_UserCompanyId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "UserCompanies");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserCompanyId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserCompanyId",
                table: "Users");
        }
    }
}
