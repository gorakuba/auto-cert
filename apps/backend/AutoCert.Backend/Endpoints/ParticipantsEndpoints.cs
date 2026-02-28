using AutoCert.Backend.Data;
using AutoCert.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoCert.Backend.Endpoints;

public static class ParticipantsEndpoints
{
    public static void MapParticipantsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/participants").WithTags("Participants");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Participants.ToListAsync())
        .WithName("GetParticipants")
        .WithSummary("Retrieves a list of all participants");

        group.MapPost("/bulk", async (AppDbContext db, List<Participant> participants) =>
        {
            db.Participants.RemoveRange(db.Participants);
            await db.SaveChangesAsync();

            foreach (var p in participants)
            {
                if (string.IsNullOrEmpty(p.Id))
                    p.Id = Guid.NewGuid().ToString();
            }

            db.Participants.AddRange(participants);
            await db.SaveChangesAsync();

            return Results.Ok(new { count = participants.Count });
        })
        .WithName("BulkSetParticipants")
        .WithSummary("Replaces the participant list with a new one (bulk upsert)");

        group.MapDelete("/", async (AppDbContext db) =>
        {
            db.Participants.RemoveRange(db.Participants);
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteAllParticipants")
        .WithSummary("Deletes all participants");
    }
}
