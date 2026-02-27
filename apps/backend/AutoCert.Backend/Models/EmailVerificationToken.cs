namespace AutoCert.Backend.Models;

public class EmailVerificationToken
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty; // SHA-256
    public DateTime ExpiresAt { get; set; } // +24 godziny
    public bool IsUsed { get; set; } = false;
}
