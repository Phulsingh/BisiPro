using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.Commands.Register
{
    public class RegisterCommandValidator: AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.Request.FirstName)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Request.LastName)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Request.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Request.PhoneNumber)
               .NotEmpty()
               .Matches(@"^[0-9]{10}$")
               .WithMessage("Phone number must contain exactly 10 digits.");

            RuleFor(x => x.Request.Password)
                .NotEmpty()
                .MinimumLength(8)
                .MaximumLength(100)
                .Matches(@"[A-Z]")
                .WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]")
                .WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"[0-9]")
                .WithMessage("Password must contain at least one number.");

            RuleFor(x => x.Request.DateOfBirth)
              .NotEmpty()
              .Must(BeAtLeast18YearsOld)
              .WithMessage("User must be at least 18 years old.");
        }
        private bool BeAtLeast18YearsOld(DateOnly dateOfBirth)
        {
            return dateOfBirth <= DateOnly.FromDateTime(DateTime.Today.AddYears(-18));
        }

    }
}
