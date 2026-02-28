using AutoCert.Backend.Data;
using AutoCert.Backend.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var dbPath = builder.Configuration["DB_PATH"]
    ?? Path.Combine(builder.Environment.ContentRootPath, "auto-cert.db");

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "AutoCert.Backend",
        Version = "v1",
        Description = "REST API for AutoCert certificate generation system"
    });
});

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(opt => opt.AddDefaultPolicy(policy =>
    policy.WithOrigins(allowedOrigins)
          .AllowAnyMethod()
          .AllowAnyHeader()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AutoCert.Backend v1");
        c.RoutePrefix = "swagger";
    });
}

if (app.Environment.IsProduction())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapFallbackToFile("index.html");
}

app.MapParticipantsEndpoints();
app.MapSettingsEndpoints();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", version = "1.0.0" }))
   .WithTags("Health")
   .WithSummary("Checks if API is running");

var port = builder.Configuration["PORT"] ?? "5050";
app.Run($"http://0.0.0.0:{port}");

public partial class Program { }
