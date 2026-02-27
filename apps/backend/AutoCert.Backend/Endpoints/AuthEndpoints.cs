using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoCert.Backend.Data;
using AutoCert.Backend.Models;
using AutoCert.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoCert.Backend.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/register", async (AppDbContext db, EmailService emailService, IConfiguration config, RegisterRequest req) =>
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return Results.BadRequest(new { error = "Email and password are required" });

            if (await db.Users.AnyAsync(u => u.Email == req.Email))
                return Results.Conflict(new { error = "User with this email already exists" });

            var user = new User
            {
                Email = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            db.Users.Add(user);

            // Generate Email Verification Token
            var tokenRaw = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var tokenHash = ComputeSha256(tokenRaw);

            var verifyToken = new EmailVerificationToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
            db.EmailVerificationTokens.Add(verifyToken);
            await db.SaveChangesAsync();

            var appUrl = config["Email:AppBaseUrl"]?.TrimEnd('/');
            var link = $"{appUrl}/verify-email?token={tokenRaw}";
            
            // Fire and forget email or await (await is safer to guarantee delivery but blocks request)
            await emailService.SendEmailVerificationAsync(user.Email, link);

            return Results.Ok(new { message = "Registered successfully. Please check your email to verify your account." });
        })
        .WithName("Register");

        group.MapPost("/login", async (AppDbContext db, IConfiguration config, HttpContext ctx, LoginRequest req) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Results.Unauthorized();

            if (!user.IsEmailVerified)
                return Results.StatusCode(403); // Special code to distinct from bad credentials. Return 403 Forbidden with custom error body.
                // Note: minimal apis Results.Json inside 403 is tricky, let's use Results.Json(..., statusCode: 403);
            
            // Check verification inline
            if (!user.IsEmailVerified)
                return Results.Json(new { error = "email_not_verified" }, statusCode: 403);

            var accessToken = GenerateAccessToken(user, config);
            var refreshTokenRaw = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            
            var expiresInDays = req.RememberMe 
                ? config.GetValue<int>("Jwt:RefreshTokenDaysRememberMe", 7)
                : config.GetValue<int>("Jwt:RefreshTokenDaysDefault", 1);

            var rt = new RefreshToken
            {
                UserId = user.Id,
                Token = ComputeSha256(refreshTokenRaw),
                ExpiresAt = DateTime.UtcNow.AddDays(expiresInDays)
            };
            db.RefreshTokens.Add(rt);
            await db.SaveChangesAsync();

            SetRefreshTokenCookie(ctx, refreshTokenRaw, rt.ExpiresAt);

            return Results.Ok(new { accessToken });
        })
        .WithName("Login");

        group.MapPost("/refresh", async (AppDbContext db, IConfiguration config, HttpContext ctx) =>
        {
            if (!ctx.Request.Cookies.TryGetValue("refreshToken", out var rawToken))
                return Results.Unauthorized();

            var tokenHash = ComputeSha256(rawToken);
            var rt = await db.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(r => r.Token == tokenHash);

            if (rt == null || rt.IsRevoked || rt.ExpiresAt < DateTime.UtcNow)
                return Results.Unauthorized();

            // Revoke old
            rt.IsRevoked = true;

            var user = await db.Users.FindAsync(rt.UserId);
            if (user == null) return Results.Unauthorized();

            var newAccessToken = GenerateAccessToken(user, config);
            var newRawToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var newRt = new RefreshToken
            {
                UserId = user.Id,
                Token = ComputeSha256(newRawToken),
                ExpiresAt = DateTime.UtcNow.AddDays(1) // Or preserve the original remember me duration. For simplicity, just add 1 day or 7. Let's do 7 by default on refresh.
            };
            db.RefreshTokens.Add(newRt);
            await db.SaveChangesAsync();

            SetRefreshTokenCookie(ctx, newRawToken, newRt.ExpiresAt);

            return Results.Ok(new { accessToken = newAccessToken });
        })
        .WithName("Refresh");

        group.MapPost("/logout", async (AppDbContext db, HttpContext ctx) =>
        {
            if (ctx.Request.Cookies.TryGetValue("refreshToken", out var rawToken))
            {
                var tokenHash = ComputeSha256(rawToken);
                var rt = await db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == tokenHash);
                if (rt != null)
                {
                    rt.IsRevoked = true;
                    await db.SaveChangesAsync();
                }
            }

            ctx.Response.Cookies.Delete("refreshToken");
            return Results.NoContent();
        })
        .WithName("Logout");

        group.MapGet("/me", [Authorize] (HttpContext ctx) =>
        {
            var userId = ctx.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = ctx.User.FindFirst(ClaimTypes.Email)?.Value;
            return Results.Ok(new { id = userId, email });
        })
        .WithName("GetMe");

        // Verification
        group.MapGet("/verify-email", async (AppDbContext db, string token) =>
        {
            var tokenHash = ComputeSha256(token);
            var verifyToken = await db.EmailVerificationTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
            
            if (verifyToken == null || verifyToken.IsUsed || verifyToken.ExpiresAt < DateTime.UtcNow)
                return Results.BadRequest(new { error = "Invalid or expired token" });

            verifyToken.IsUsed = true;
            var user = await db.Users.FindAsync(verifyToken.UserId);
            if (user != null)
                user.IsEmailVerified = true;

            await db.SaveChangesAsync();
            return Results.Ok(new { message = "Email verified successfully" });
        })
        .WithName("VerifyEmail");

        group.MapPost("/resend-verification", async (AppDbContext db, EmailService emailService, IConfiguration config, ResendVerificationRequest req) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || user.IsEmailVerified) return Results.Ok(); // silently succeed for security

            var tokenRaw = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var verifyToken = new EmailVerificationToken
            {
                UserId = user.Id,
                TokenHash = ComputeSha256(tokenRaw),
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
            db.EmailVerificationTokens.Add(verifyToken);
            await db.SaveChangesAsync();

            var appUrl = config["Email:AppBaseUrl"]?.TrimEnd('/');
            var link = $"{appUrl}/verify-email?token={tokenRaw}";
            
            await emailService.SendEmailVerificationAsync(user.Email, link);

            return Results.Ok();
        });

        // Password Reset
        group.MapPost("/forgot-password", async (AppDbContext db, EmailService emailService, IConfiguration config, ForgotPasswordRequest req) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return Results.Ok(); // Silently succeed

            var tokenRaw = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = ComputeSha256(tokenRaw),
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            };
            db.PasswordResetTokens.Add(resetToken);
            await db.SaveChangesAsync();

            var appUrl = config["Email:AppBaseUrl"]?.TrimEnd('/');
            var link = $"{appUrl}/reset-password?token={tokenRaw}";

            await emailService.SendPasswordResetAsync(user.Email, link);

            return Results.Ok();
        });

        group.MapPost("/reset-password", async (AppDbContext db, ResetPasswordRequest req) =>
        {
            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 8)
                return Results.BadRequest(new { error = "Password must be at least 8 characters" });

            var tokenHash = ComputeSha256(req.Token);
            var resetToken = await db.PasswordResetTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

            if (resetToken == null || resetToken.IsUsed || resetToken.ExpiresAt < DateTime.UtcNow)
                return Results.BadRequest(new { error = "Invalid or expired token" });

            resetToken.IsUsed = true;
            var user = await db.Users.FindAsync(resetToken.UserId);
            if (user != null)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        });
    }

    private static string GenerateAccessToken(User user, IConfiguration config)
    {
        var keyParam = config["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyParam));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var minutes = config.GetValue("Jwt:AccessTokenMinutes", 15);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(minutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static void SetRefreshTokenCookie(HttpContext ctx, string token, DateTime expiresAt)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Ensure we are on HTTPS in prod, vite dev might be HTTP though, so be careful. For dev without SSL, we might need Secure=false. We'll set SameSite=Strict.
            SameSite = SameSiteMode.Strict,
            Expires = expiresAt
        };
        ctx.Response.Cookies.Append("refreshToken", token, options);
    }

    private static string ComputeSha256(string rawToken)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(rawToken);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password, bool RememberMe = false);
public record ResendVerificationRequest(string Email);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Token, string NewPassword);
