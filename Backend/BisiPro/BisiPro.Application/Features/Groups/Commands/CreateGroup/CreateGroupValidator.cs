using BisiPro.Domain.Enums;
using FluentValidation;

namespace BisiPro.Application.Features.Groups.Commands.CreateGroup
{
    public class CreateGroupValidator
        : AbstractValidator<CreateGroupCommand>
    {
        public CreateGroupValidator()
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

            RuleFor(x => x.Request.StartDate)
                .GreaterThanOrEqualTo(
                    DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Start date cannot be in the past.");

            RuleFor(x => x.Request.CollectionDay)
                .InclusiveBetween(1, 31)
                .WithMessage(
                    "Collection day must be between 1 and 31.");

            RuleFor(x => x.Request.LateFee)
                .GreaterThanOrEqualTo(0)
                .WithMessage(
                    "Late fee cannot be negative.");

            RuleFor(x => x.Request.GracePeriod)
                .GreaterThanOrEqualTo(0)
                .WithMessage(
                    "Grace period cannot be negative.");

            RuleFor(x => x.Request.BisiType)
                .IsInEnum();

            // Auction validation
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