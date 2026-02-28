namespace AutoCert.Backend.Models;

public class Participant
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Extra { get; set; }
    public string GuestId { get; set; } = string.Empty;
}
