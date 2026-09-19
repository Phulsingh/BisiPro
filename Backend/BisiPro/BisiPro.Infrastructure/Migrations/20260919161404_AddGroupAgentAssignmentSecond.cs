using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BisiPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupAgentAssignmentSecond : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupAgent_Groups_GroupId",
                table: "GroupAgent");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupAgent_Users_AgentId",
                table: "GroupAgent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupAgent",
                table: "GroupAgent");

            migrationBuilder.RenameTable(
                name: "GroupAgent",
                newName: "GroupAgents");

            migrationBuilder.RenameIndex(
                name: "IX_GroupAgent_GroupId_AgentId",
                table: "GroupAgents",
                newName: "IX_GroupAgents_GroupId_AgentId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupAgent_AgentId",
                table: "GroupAgents",
                newName: "IX_GroupAgents_AgentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupAgents",
                table: "GroupAgents",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAgents_Groups_GroupId",
                table: "GroupAgents",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAgents_Users_AgentId",
                table: "GroupAgents",
                column: "AgentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupAgents_Groups_GroupId",
                table: "GroupAgents");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupAgents_Users_AgentId",
                table: "GroupAgents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupAgents",
                table: "GroupAgents");

            migrationBuilder.RenameTable(
                name: "GroupAgents",
                newName: "GroupAgent");

            migrationBuilder.RenameIndex(
                name: "IX_GroupAgents_GroupId_AgentId",
                table: "GroupAgent",
                newName: "IX_GroupAgent_GroupId_AgentId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupAgents_AgentId",
                table: "GroupAgent",
                newName: "IX_GroupAgent_AgentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupAgent",
                table: "GroupAgent",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAgent_Groups_GroupId",
                table: "GroupAgent",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAgent_Users_AgentId",
                table: "GroupAgent",
                column: "AgentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
