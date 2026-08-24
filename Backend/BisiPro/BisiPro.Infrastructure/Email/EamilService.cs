using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net.Mail;
using BisiPro.Application.Interfaces.Repositories;

namespace BisiPro.Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(
            IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendPasswordResetEmailAsync(
            string email,
            string resetLink,
            CancellationToken cancellationToken)
        {
            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(
                    _settings.FromName,
                    _settings.FromEmail));

            message.To.Add(
                MailboxAddress.Parse(email));

            message.Subject = "Reset Your BisiPro Password";

            var body = $"""
                <html>
                <body>
                    <h2>Password Reset Request</h2>

                    <p>Hello,</p>

                    <p>
                        We received a request to reset your BisiPro password.
                    </p>

                    <p>
                        Click the button below to reset your password:
                    </p>

                    <p>
                        <a href="{resetLink}"
                           style="
                           display:inline-block;
                           padding:12px 20px;
                           background:#000;
                           color:#fff;
                           text-decoration:none;
                           border-radius:6px;">
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <br />

                    <p>
                        Regards,<br />
                        BisiPro Team
                    </p>
                </body>
                </html>
                """;

            message.Body = new BodyBuilder
            {
                HtmlBody = body
            }.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            await smtp.ConnectAsync(
                _settings.SmtpServer,
                _settings.Port,
                SecureSocketOptions.StartTls,
                cancellationToken);

            await smtp.AuthenticateAsync(
                _settings.Username,
                _settings.Password,
                cancellationToken);

            await smtp.SendAsync(
                message,
                cancellationToken);

            await smtp.DisconnectAsync(
                true,
                cancellationToken);
        }
    }
}