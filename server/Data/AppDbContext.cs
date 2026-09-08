using LinkCard.Entities;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>, IDataProtectionKeyContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<UserLink> UserLinks => Set<UserLink>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserLink>(entity =>
        {
            entity.HasKey(l => l.Id);

            entity.HasIndex(l => new { l.UserId, l.Order });

            entity.Property(l => l.Title)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(l => l.Url)
                .HasMaxLength(2048)
                .IsRequired();

            entity.HasOne(l => l.User)
                .WithMany(u => u.Links)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ApplicationUser>()
            .OwnsOne(u => u.Styles, styles =>
            {
                styles.ToJson();

                styles.OwnsOne(s => s.Typography, typography =>
                {
                    typography.Property(t => t.FontWeight).HasConversion<string>();
                    typography.Property(t => t.TextAlign).HasConversion<string>();
                });

                styles.OwnsOne(s => s.Colors, colors =>
                {
                    colors.OwnsOne(c => c.Button);
                });

                styles.OwnsOne(s => s.Layout);

                styles.OwnsOne(s => s.Background, background =>
                {
                    background.OwnsOne(b => b.Value, value =>
                    {
                        value.Property(v => v.Position).HasConversion<string>();
                        value.Property(v => v.Size).HasConversion<string>();
                        value.Property(v => v.Repeat).HasConversion<string>();
                        value.OwnsOne(v => v.Gradient);
                    });
                });
            }
        );

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(rt => rt.Id);

            entity.HasIndex(rt => rt.TokenHash)
                .IsUnique();

            entity.HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}