using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BisiPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupMemberAndUserChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KycStatus",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "NomineeName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NomineePhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Village",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupMember",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PayableAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JoinedDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ExitDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupMember_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupMember_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupMember_GroupId_UserId",
                table: "GroupMember",
                columns: new[] { "GroupId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupMember_UserId",
                table: "GroupMember",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupMember");

            migrationBuilder.DropColumn(
                name: "KycStatus",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NomineeName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NomineePhoneNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Village",
                table: "Users");
        }
    }
}
