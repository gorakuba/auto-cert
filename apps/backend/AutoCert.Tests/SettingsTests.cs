using System.Net.Http.Json;
using AutoCert.Backend.Endpoints;
using Xunit;

namespace AutoCert.Tests;

public class SettingsTests : IntegrationTestBase
{
    public SettingsTests(Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactory<Program> factory) : base(factory) { }

    [Fact]
    public async Task GetSetting_ReturnsNotFound_IfKeyDoesNotExist()
    {
        var response = await Client.GetAsync("/api/settings/non-existent-key");

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PutSetting_CreatesAndUpdatesValue()
    {
        var key = "test-setting-key";
        var initialValue = "initial-value";
        var updatedValue = "updated-value";

        var createResponse = await Client.PutAsJsonAsync($"/api/settings/{key}", new SettingValueDto(initialValue));
        createResponse.EnsureSuccessStatusCode();

        var getResponse1 = await Client.GetAsync($"/api/settings/{key}");
        var data1 = await getResponse1.Content.ReadFromJsonAsync<SettingResponse>();
        Assert.Equal(initialValue, data1?.Value);

        var updateResponse = await Client.PutAsJsonAsync($"/api/settings/{key}", new SettingValueDto(updatedValue));
        updateResponse.EnsureSuccessStatusCode();

        var getResponse2 = await Client.GetAsync($"/api/settings/{key}");
        var data2 = await getResponse2.Content.ReadFromJsonAsync<SettingResponse>();
        Assert.Equal(updatedValue, data2?.Value);
    }
}

public class SettingResponse
{
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
}
