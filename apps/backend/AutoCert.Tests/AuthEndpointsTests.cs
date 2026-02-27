using System.Net;
using System.Net.Http.Json;
using AutoCert.Backend.Data;
using AutoCert.Backend.Endpoints;
using AutoCert.Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AutoCert.Tests;

public class AuthEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public AuthEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptors = services.Where(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                         d.ServiceType == typeof(AppDbContext)).ToList();

                foreach (var descriptor in descriptors)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseSqlite("Data Source=test.db");
                });
            });
        });

        // Ensure database is created
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted(); // Czysta baza dla testów uwierzytelniania
        db.Database.EnsureCreated();

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidData_ReturnsOkAndCreatesUser()
    {
        // Arrange
        var request = new RegisterRequest("newuser@example.com", "Password123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        response.EnsureSuccessStatusCode();

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == "newuser@example.com");
        
        Assert.NotNull(user);
        Assert.False(user.IsEmailVerified);
        
        var token = await db.EmailVerificationTokens.FirstOrDefaultAsync(t => t.UserId == user.Id);
        Assert.NotNull(token);
    }

    [Fact]
    public async Task Login_UnverifiedEmail_ReturnsForbidden()
    {
        // Arrange
        var request = new RegisterRequest("unverified@example.com", "Password123!");
        await _client.PostAsJsonAsync("/api/auth/register", request);

        var loginReq = new LoginRequest("unverified@example.com", "Password123!", false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginReq);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Login_VerifiedEmail_ReturnsToken()
    {
        // Arrange
        var email = "verified@example.com";
        var password = "Password123!";
        var registerReq = new RegisterRequest(email, password);
        await _client.PostAsJsonAsync("/api/auth/register", registerReq);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var user = await db.Users.FirstAsync(u => u.Email == email);
            user.IsEmailVerified = true;
            await db.SaveChangesAsync();
        }

        var loginReq = new LoginRequest(email, password, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginReq);

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.NotNull(content);
        
        // Response should set cookie
        Assert.Contains(response.Headers.GetValues("Set-Cookie"), 
            c => c.Contains("refreshToken="));
    }
}
