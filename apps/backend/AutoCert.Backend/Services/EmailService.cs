using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace AutoCert.Backend.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendPasswordResetAsync(string toEmail, string resetLink)
    {
        var subject = "Zresetuj swoje hasło w AutoCert";
        var body = $@"
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #4f46e5;'>Reset hasła</h2>
                <p>Otrzymaliśmy prośbę o reset hasła do Twojego konta w AutoCert.</p>
                <p>Aby zresetować hasło, kliknij w poniższy link:</p>
                <div style='margin: 30px 0;'>
                    <a href='{resetLink}' style='background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Zresetuj hasło</a>
                </div>
                <p>Link jest ważny przez 1 godzinę.</p>
                <p style='color: #6b7280; font-size: 14px;'>Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
            </div>
        ";

        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendEmailVerificationAsync(string toEmail, string verifyLink)
    {
        var subject = "Zweryfikuj swój adres email w AutoCert";
        var body = $@"
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #4f46e5;'>Witaj w AutoCert!</h2>
                <p>Dziękujemy za rejestrację. Aby aktywować swoje konto, musisz zweryfikować adres email.</p>
                <p>Kliknij w poniższy link, aby ukończyć rejestrację:</p>
                <div style='margin: 30px 0;'>
                    <a href='{verifyLink}' style='background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Zweryfikuj email</a>
                </div>
                <p>Link jest ważny przez 24 godziny.</p>
            </div>
        ";

        await SendEmailAsync(toEmail, subject, body);
    }

    private async Task SendEmailAsync(string toParam, string subject, string htmlBody)
    {
        try
        {
            var host = _config["Email:SmtpHost"];
            var portString = _config["Email:SmtpPort"];
            var user = _config["Email:Username"];
            var pass = _config["Email:Password"];
            var fromAddress = _config["Email:FromAddress"];
            var fromName = _config["Email:FromName"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
            {
                _logger.LogWarning("Brak pełnej konfiguracji SMTP. Pomijanie wysyłki emaila do: {Email}", toParam);
                return;
            }

            int.TryParse(portString, out int port);
            if (port == 0) port = 587;

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromAddress));
            message.To.Add(MailboxAddress.Parse(toParam));
            message.Subject = subject;
            message.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(user, pass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Wysłano email na adres: {Email}", toParam);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Błąd podczas wysyłania emaila do: {Email}", toParam);
            throw; // Let caller handle or just log and ignore? For Auth we might want to fail the request if it's crucial. 
            // In ForgotPassword, failing is bad UX, so we throw to show 500 error.
        }
    }
}
