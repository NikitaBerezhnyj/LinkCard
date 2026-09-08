using LinkCard.Options;
using LinkCard.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace LinkCard.Services;

public class SmtpEmailSender(EmailOptions options) : IEmailSender
{
    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(options.FromName, options.Email));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(options.Host, options.Port, SecureSocketOptions.Auto, ct);

        if (!string.IsNullOrEmpty(options.Password))
            await client.AuthenticateAsync(options.Email, options.Password, ct);

        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }
}