using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BisiPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupAgentAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_AgentId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_AgentId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "AgentId",
                table: "Groups");

            migrationBuilder.CreateTable(
                name: "GroupAgent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AgentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupAgent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupAgent_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupAgent_Users_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupAgent_AgentId",
                table: "GroupAgent",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupAgent_GroupId_AgentId",
                table: "GroupAgent",
                columns: new[] { "GroupId", "AgentId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupAgent");

            migrationBuilder.AddColumn<Guid>(
                name: "AgentId",
                table: "Groups",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Groups_AgentId",
                table: "Groups",
                column: "AgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_AgentId",
                table: "Groups",
                column: "AgentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
