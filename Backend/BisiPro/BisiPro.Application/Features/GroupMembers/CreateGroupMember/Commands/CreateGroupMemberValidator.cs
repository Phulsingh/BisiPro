using FluentValidation;

namespace BisiPro.Application.Features.GroupMembers.CreateGroupMember.Commands
{
    public class CreateGroupMemberValidator
        : AbstractValidator<CreateGroupMemberCommand>
    {
        public CreateGroupMemberValidator()
        {
            RuleFor(x => x.GroupId)
                .NotEmpty()
                .WithMessage("Group is required.");

            RuleFor(x => x.AgentId)
                .NotEmpty()
                .WithMessage("Agent is required.");

            RuleFor(x => x.Request)
                .NotNull()
                .WithMessage("Request is required.");

            RuleFor(x => x.Request.UserId)
                .NotEmpty()
                .WithMessage("User is required.");
        }
    }
}
