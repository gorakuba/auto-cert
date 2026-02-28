using System.Net.Http.Json;
using AutoCert.Backend.Models;
using Xunit;

namespace AutoCert.Tests;

public class ParticipantsTests : IntegrationTestBase
{
    public ParticipantsTests(Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactory<Program> factory) : base(factory) { }

    [Fact]
    public async Task GetParticipants_ReturnsEmptyList_Initially()
    {
        var response = await Client.GetAsync("/api/participants");

        response.EnsureSuccessStatusCode();
        var participants = await response.Content.ReadFromJsonAsync<List<Participant>>();
        Assert.NotNull(participants);
    }

    [Fact]
    public async Task PostBulk_AddsParticipants()
    {
        var newParticipants = new List<Participant>
        {
            new() { Name = "Test User 1", Email = "test1@example.com" },
            new() { Name = "Test User 2", Email = "test2@example.com" }
        };

        var postResponse = await Client.PostAsJsonAsync("/api/participants/bulk", newParticipants);
        postResponse.EnsureSuccessStatusCode();

        var getResponse = await Client.GetAsync("/api/participants");
        var participants = await getResponse.Content.ReadFromJsonAsync<List<Participant>>();

        Assert.NotNull(participants);
        Assert.Contains(participants, p => p.Name == "Test User 1");
        Assert.Contains(participants, p => p.Name == "Test User 2");
    }

    [Fact]
    public async Task Delete_RemovesAllParticipants()
    {
        var newParticipants = new List<Participant>
        {
            new() { Name = "To Delete", Email = "delete@example.com" }
        };
        await Client.PostAsJsonAsync("/api/participants/bulk", newParticipants);

        var deleteResponse = await Client.DeleteAsync("/api/participants");
        deleteResponse.EnsureSuccessStatusCode();

        var getResponse = await Client.GetAsync("/api/participants");
        var participants = await getResponse.Content.ReadFromJsonAsync<List<Participant>>();

        Assert.Empty(participants!);
    }
}
