using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BisiPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGroupMemberModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMember_Groups_GroupId",
                table: "GroupMember");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupMember_Users_UserId",
                table: "GroupMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupMember",
                table: "GroupMember");

            migrationBuilder.RenameTable(
                name: "GroupMember",
                newName: "GroupMembers");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMember_UserId",
                table: "GroupMembers",
                newName: "IX_GroupMembers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMember_GroupId_UserId",
                table: "GroupMembers",
                newName: "IX_GroupMembers_GroupId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupMembers",
                table: "GroupMembers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMembers_Groups_GroupId",
                table: "GroupMembers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMembers_Users_UserId",
                table: "GroupMembers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMembers_Groups_GroupId",
                table: "GroupMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupMembers_Users_UserId",
                table: "GroupMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupMembers",
                table: "GroupMembers");

            migrationBuilder.RenameTable(
                name: "GroupMembers",
                newName: "GroupMember");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMembers_UserId",
                table: "GroupMember",
                newName: "IX_GroupMember_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupMembers_GroupId_UserId",
                table: "GroupMember",
                newName: "IX_GroupMember_GroupId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupMember",
                table: "GroupMember",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMember_Groups_GroupId",
                table: "GroupMember",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMember_Users_UserId",
                table: "GroupMember",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
