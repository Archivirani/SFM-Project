namespace Cygnux.CRM.External;

using Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options: options)
    {
    }

    public virtual DbSet<ApplicationUser> Users { get; set; }

    public virtual DbSet<ApplicationRole> Roles { get; set; }

    public virtual DbSet<ApplicationUserRole> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define composite primary key for ApplicationUserRole
        modelBuilder.Entity<ApplicationUserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });
    }
}