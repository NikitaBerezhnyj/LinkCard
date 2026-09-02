using LinkCard.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>()
            .OwnsMany(u => u.Links, links =>
            {
                links.ToJson();
            });

        builder.Entity<ApplicationUser>()
            .OwnsOne(u => u.Styles, styles =>
            {
                styles.ToJson();

                styles.OwnsOne(s => s.Typography);

                styles.OwnsOne(s => s.Colors, colors =>
                {
                    colors.OwnsOne(c => c.Button);
                });

                styles.OwnsOne(s => s.Layout);

                styles.OwnsOne(s => s.Background, background =>
                {
                    background.OwnsOne(b => b.Value, value =>
                    {
                        value.OwnsOne(v => v.Gradient);
                    });
                });
            });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(rt => rt.TokenHash).IsUnique();
            entity.HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}