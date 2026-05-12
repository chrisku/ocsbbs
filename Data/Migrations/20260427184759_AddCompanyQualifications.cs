using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyQualifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompanyQualifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bond = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowBond = table.Column<bool>(type: "bit", nullable: false),
                    Incorporation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Memo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Resolution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Eeo = table.Column<bool>(type: "bit", nullable: false),
                    EeoDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Debarment = table.Column<bool>(type: "bit", nullable: false),
                    DebarmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ForeignParent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankruptcyFlag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankruptcyStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BankruptcyEndDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QualificationRevokedFlag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QualificationRevokedStartDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QualificationRevokedEndDate = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyQualifications", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyQualifications");
        }
    }
}
