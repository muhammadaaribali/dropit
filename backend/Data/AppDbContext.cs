using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Models;
using backend.Enums;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<ShareItem> ShareItems { get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ShareItem>().Property(s=>s.Type).HasConversion<string>();

        base.OnModelCreating(modelBuilder);
    }

    //s=s.Type means for every shareitem selecr the type property and convert it to string and store in the database
    //Without HasConversion<string>(), Entity Framework stores enums as numbers.
    //base refers to the parent class (DbContext).

    //This means:
    // After my configuration, let the parent (DbContext) perform its own default configuration too.

}