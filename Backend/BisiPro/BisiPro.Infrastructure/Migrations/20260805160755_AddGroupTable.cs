using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BisiPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BisiType = table.Column<int>(type: "int", nullable: false),
                    MonthlyAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalMembers = table.Column<int>(type: "int", nullable: false),
                    DurationInMonths = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CollectionDay = table.Column<int>(type: "int", nullable: false),
                    AuctionDay = table.Column<int>(type: "int", nullable: true),
                    LateFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GracePeriod = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AgentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Groups_Users_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Groups_AgentId",
                table: "Groups",
                column: "AgentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Groups");
        }
    }
}
