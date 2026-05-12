using Microsoft.Extensions.Options;
using OCSBBS.Auth.Configuration;
using OCSBBS.Infrastructure.Configuration;
using System.Net;
using System.Net.Mail;
using OCSBBS.Core.Interfaces.Infrastructure;

namespace OCSBBS.Auth.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_settings.FromAddress, _settings.FromName),
                Subject = "Reset Your Password",
                IsBodyHtml = true,
                Body = $@"
                    <p>You requested a password reset for your OCSBBS account.</p>
                    <p>Click the link below to reset your password. This link expires in 24 hours.</p>
                    <p><a href='{resetLink}'>Reset Password</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                "
            };

            message.To.Add(toEmail);

            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}