using AutoCert.Backend.Data;
using AutoCert.Backend.Models;

namespace AutoCert.Backend.Endpoints;

public static class SettingsEndpoints
{
    public static void MapSettingsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/settings").WithTags("Settings");

        group.MapGet("/{key}", async (AppDbContext db, string key) =>
        {
            var setting = await db.Settings.FindAsync(key);
            return Results.Ok(new { key, value = setting?.Value });
        })
        .WithName("GetSetting")
        .WithSummary("Retrieves a setting value by key");

        group.MapPut("/{key}", async (AppDbContext db, string key, SettingValueDto dto) =>
        {
            var existing = await db.Settings.FindAsync(key);
            if (existing is null)
            {
                db.Settings.Add(new Setting { Key = key, Value = dto.Value });
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
