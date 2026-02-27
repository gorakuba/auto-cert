using AutoCert.Backend.Data;
using AutoCert.Backend.Models;

namespace AutoCert.Backend.Endpoints;

public static class SettingsEndpoints
{
    public static void MapSettingsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/settings").WithTags("Settings").RequireAuthorization();

        // GET /api/settings/{key}
        group.MapGet("/{key}", async (AppDbContext db, HttpContext ctx, string key) =>
        {
            var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Results.Unauthorized();

            var setting = await db.Settings.FindAsync(userId, key);
            return setting is null
                ? Results.NotFound(new { key, value = (string?)null })
                : Results.Ok(new { key = setting.Key, value = setting.Value });
        })
        .WithName("GetSetting")
        .WithSummary("Retrieves a setting value by key for the user");

        // PUT /api/settings/{key}
        group.MapPut("/{key}", async (AppDbContext db, HttpContext ctx, string key, SettingValueDto dto) =>
        {
            var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Results.Unauthorized();

            // Find by composite key: (UserId, Key)
            var existing = await db.Settings.FindAsync(userId, key);
            if (existing is null)
            {
                db.Settings.Add(new Setting { UserId = userId, Key = key, Value = dto.Value });
            }
            else
            {
                existing.Value = dto.Value;
            }
            await db.SaveChangesAsync();
            return Results.Ok(new { key, value = dto.Value });
        })
        .WithName("SetSetting")
        .WithSummary("Sets (or overwrites) a setting value");
    }
}

public record SettingValueDto(string Value);
