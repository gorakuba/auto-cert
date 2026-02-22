using AutoCert.Backend.Data;
using AutoCert.Backend.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Database ---
var dbPath = builder.Configuration["DB_PATH"]
    ?? Path.Combine(builder.Environment.ContentRootPath, "auto-cert.db");

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite($"Data Source={dbPath}"));

// --- Swagger/OpenAPI ---
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

// --- CORS (dev: allow Vite dev server) ---
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(opt => opt.AddDefaultPolicy(policy =>
    policy.WithOrigins(allowedOrigins)
          .AllowAnyMethod()
          .AllowAnyHeader()));

var app = builder.Build();

// --- Migrations (auto-apply on startup) ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// --- Middleware ---
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

// --- Production: serve React build ---
if (app.Environment.IsProduction())
{
    app.UseDefaultFiles();   // index.html as default
    app.UseStaticFiles();    // serves wwwroot/ (React dist/)
    app.MapFallbackToFile("index.html");  // SPA routing fallback
}

// --- API Endpoints ---
app.MapParticipantsEndpoints();
app.MapSettingsEndpoints();

// Health check
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", version = "1.0.0" }))
   .WithTags("Health")
   .WithSummary("Checks if API is running");

var port = builder.Configuration["PORT"] ?? "5050";
app.Run($"http://0.0.0.0:{port}");

public partial class Program { }
