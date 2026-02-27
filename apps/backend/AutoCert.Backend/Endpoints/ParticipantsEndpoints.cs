using AutoCert.Backend.Data;
using AutoCert.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoCert.Backend.Endpoints;

public static class ParticipantsEndpoints
{
    public static void MapParticipantsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/participants").WithTags("Participants").RequireAuthorization();

        // GET /api/participants - Retrieve all participants
        group.MapGet("/", async (AppDbContext db, HttpContext ctx) =>
        {
            var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Results.Unauthorized();
            return Results.Ok(await db.Participants.Where(p => p.UserId == userId).ToListAsync());
        })
        .WithName("GetParticipants")
        .WithSummary("Retrieves a list of all participants for the user");

        // POST /api/participants/bulk - Replace the entire participant list
        group.MapPost("/bulk", async (AppDbContext db, HttpContext ctx, List<Participant> participants) =>
        {
            var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Results.Unauthorized();

            // Remove existing and insert new for THIS user
            var existing = await db.Participants.Where(p => p.UserId == userId).ToListAsync();
            db.Participants.RemoveRange(existing);
            await db.SaveChangesAsync();

            foreach (var p in participants)
            {
                p.UserId = userId;
                if (string.IsNullOrEmpty(p.Id))
                    p.Id = Guid.NewGuid().ToString();
            }

            db.Participants.AddRange(participants);
            await db.SaveChangesAsync();

            return Results.Ok(new { count = participants.Count });
        })
        .WithName("BulkSetParticipants")
        .WithSummary("Replaces the participant list with a new one (bulk upsert)");

        // DELETE /api/participants - Delete all participants
        group.MapDelete("/", async (AppDbContext db, HttpContext ctx) =>
        {
            var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Results.Unauthorized();

            var existing = await db.Participants.Where(p => p.UserId == userId).ToListAsync();
            db.Participants.RemoveRange(existing);
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteAllParticipants")
        .WithSummary("Deletes all participants");
    }
}
