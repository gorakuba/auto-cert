using AutoCert.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoCert.Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Participant> Participants => Set<Participant>();
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Setting>().HasKey(s => s.Key);
    }
}
