using BisiPro.Domain.Enums;
using FluentValidation;

namespace BisiPro.Application.Features.Groups.Commands.UpdateGroup
{
    public class UpdateGroupCommandValidator
        : AbstractValidator<UpdateGroupCommand>
    {
        public UpdateGroupCommandValidator()
        {
            RuleFor(x => x.Request.GroupName)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Request.Description)
                .MaximumLength(500);

            RuleFor(x => x.Request.MonthlyAmount)
                .GreaterThan(0)
                .WithMessage("Monthly amount must be greater than zero.");

            RuleFor(x => x.Request.TotalMembers)
                .GreaterThan(1)
                .WithMessage("Group must have at least 2 members.");

            RuleFor(x => x.Request.DurationInMonths)
                .GreaterThan(0)
                .WithMessage("Duration must be greater than zero.");

            RuleFor(x => x.Request.CollectionDay)
                .InclusiveBetween(1, 31);

            RuleFor(x => x.Request.LateFee)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Request.GracePeriod)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Request.BisiType)
                .IsInEnum();

            When(
                x => x.Request.BisiType == BisiType.Auction,
                () =>
                {
                    RuleFor(x => x.Request.AuctionDay)
                        .NotNull()
                        .InclusiveBetween(1, 31)
                        .WithMessage(
                            "Auction day is required for Auction Bisi.");
                });
        }
    }
}