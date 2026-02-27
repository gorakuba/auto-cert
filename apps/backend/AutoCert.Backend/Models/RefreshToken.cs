namespace AutoCert.Backend.Models;

public class RefreshToken
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty; // hashed
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;
}
