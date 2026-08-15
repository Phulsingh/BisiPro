using BisiPro.Application.Features.Authentications.Commands.Register;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BisiPro.Application.Features.Authentications.Commands.Login
{
    public class LoginCommandValidator : AbstractValidator<RegisterCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Request.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Request.Password)
                .NotEmpty();
        }
    }

}
