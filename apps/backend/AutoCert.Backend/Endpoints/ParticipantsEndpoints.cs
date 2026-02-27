using AutoCert.Backend.Data;
using AutoCert.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoCert.Backend.Endpoints;

public static class ParticipantsEndpoints
{
    public static void MapParticipantsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/participants").WithTags("Participants");

        // GET /api/participants - Retrieve all participants
        group.MapGet("/", async (AppDbContext db, [Microsoft.AspNetCore.Mvc.FromHeader(Name = "X-Guest-ID")] string guestId) =>
            await db.Participants.Where(p => p.GuestId == guestId).ToListAsync())
        .WithName("GetParticipants")
        .WithSummary("Retrieves a list of all participants");

        // POST /api/participants/bulk - Replace the entire participant list
        group.MapPost("/bulk", async (AppDbContext db, [Microsoft.AspNetCore.Mvc.FromHeader(Name = "X-Guest-ID")] string guestId, List<Participant> participants) =>
        {
            // Remove existing and insert new (bulk replace)
            var existing = await db.Participants.Where(p => p.GuestId == guestId).ToListAsync();
            db.Participants.RemoveRange(existing);
            await db.SaveChangesAsync();

            foreach (var p in participants)
            {
                if (string.IsNullOrEmpty(p.Id))
                    p.Id = Guid.NewGuid().ToString();
                p.GuestId = guestId;
            }

            db.Participants.AddRange(participants);
            await db.SaveChangesAsync();

            return Results.Ok(new { count = participants.Count });
        })
        .WithName("BulkSetParticipants")
        .WithSummary("Replaces the participant list with a new one (bulk upsert)");

        // DELETE /api/participants - Delete all participants
        group.MapDelete("/", async (AppDbContext db, [Microsoft.AspNetCore.Mvc.FromHeader(Name = "X-Guest-ID")] string guestId) =>
        {
            var existing = await db.Participants.Where(p => p.GuestId == guestId).ToListAsync();
            db.Participants.RemoveRange(existing);
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("DeleteAllParticipants")
        .WithSummary("Deletes all participants");
    }
}
