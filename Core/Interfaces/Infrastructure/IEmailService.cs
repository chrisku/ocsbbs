namespace OCSBBS.Core.Interfaces.Infrastructure
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string toEmail, string resetLink);
    }
}