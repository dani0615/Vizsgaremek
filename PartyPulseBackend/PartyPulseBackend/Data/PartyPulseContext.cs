using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PartyPulseBackend.Models;


namespace PartyPulseBackend.Data;

public partial class PartyPulseContext : DbContext
{
    public PartyPulseContext()
    {
    }

    public PartyPulseContext(DbContextOptions<PartyPulseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attendance> Attendances { get; set; }
    public virtual DbSet<Badge> Badges { get; set; }
    public virtual DbSet<Chatmessage> Chatmessages { get; set; }
    public virtual DbSet<Event> Events { get; set; }
    public virtual DbSet<Eventfavorite> Eventfavorites { get; set; }
    public virtual DbSet<Match> Matches { get; set; }
    public virtual DbSet<Passwordsalt> Passwordsalts { get; set; }
    public virtual DbSet<Ranking> Rankings { get; set; }
    public virtual DbSet<Review> Reviews { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserBadge> Userbadges { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_hungarian_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.EventID })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.Property(e => e.PointsEarned).HasDefaultValueSql("'0'");
            entity.Property(e => e.RegisteredAt).HasDefaultValueSql("current_timestamp()");
            entity.Property(e => e.Status).HasDefaultValueSql("'going'");

            entity.HasOne(d => d.Event).WithMany(p => p.Attendances).HasConstraintName("Attendances_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Attendances).HasConstraintName("Attendances_ibfk_1");
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(e => e.BadgeID).HasName("PRIMARY");

            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<Chatmessage>(entity =>
        {
            entity.HasKey(e => e.MessageID).HasName("PRIMARY");

            entity.Property(e => e.IsRead).HasDefaultValueSql("'0'");
            entity.Property(e => e.SentAt).HasDefaultValueSql("current_timestamp()");

            entity.HasOne(d => d.Match).WithMany(p => p.Chatmessages).HasConstraintName("Chatmessages_ibfk_1");

            entity.HasOne(d => d.Sender).WithMany(p => p.Chatmessages).HasConstraintName("Chatmessages_ibfk_2");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventID).HasName("PRIMARY");

            entity.HasIndex(e => new { e.Title, e.Description }, "ft_search").HasAnnotation("MySql:FullTextIndex", true);

            entity.HasIndex(e => e.Location, "idx_location")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 32 })
                .HasAnnotation("MySql:SpatialIndex", true);

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("current_timestamp()");
            entity.Property(e => e.IsPublic).HasDefaultValueSql("'1'");
            entity.Property(e => e.TicketPrice).HasDefaultValueSql("'0.00'");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Events)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Events_ibfk_1");
        });

        modelBuilder.Entity<Eventfavorite>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.EventID })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("current_timestamp()");

            entity.HasOne(d => d.Event).WithMany(p => p.Eventfavorites).HasConstraintName("Eventfavorites_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Eventfavorites).HasConstraintName("Eventfavorites_ibfk_1");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchID).HasName("PRIMARY");

            entity.Property(e => e.User1Liked).HasDefaultValueSql("'1'");

            entity.HasOne(d => d.User1).WithMany(p => p.MatchUser1s).HasConstraintName("matches_ibfk_1");

            entity.HasOne(d => d.User2).WithMany(p => p.MatchUser2s).HasConstraintName("matches_ibfk_2");
        });

        modelBuilder.Entity<Passwordsalt>(entity =>
        {
            entity.HasKey(e => e.UserID).HasName("PRIMARY");

            entity.Property(e => e.UserID).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("current_timestamp()");
            entity.Property(e => e.PasswordHash).IsFixedLength();
            entity.Property(e => e.Salt).IsFixedLength();

            entity.HasOne(d => d.User).WithOne(p => p.Passwordsalt).HasConstraintName("Passwordsalts_ibfk_1");
        });

        modelBuilder.Entity<Ranking>(entity =>
        {
            entity.HasKey(e => new { e.RankType, e.Period, e.Score, e.UserID })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0, 0 });

            entity.Property(e => e.Period).IsFixedLength();

            entity.HasOne(d => d.User).WithMany(p => p.Rankings).HasConstraintName("Rankings_ibfk_1");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewID).HasName("PRIMARY");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("current_timestamp()");

            entity.HasOne(d => d.Event).WithMany(p => p.Reviews).HasConstraintName("Reviews_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews).HasConstraintName("Reviews_ibfk_2");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserID).HasName("PRIMARY");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("current_timestamp()");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.IsVerified).HasDefaultValueSql("'0'");
            entity.Property(e => e.LookingFor).HasDefaultValueSql("'both'");
            entity.Property(e => e.Role).HasDefaultValueSql("'user'");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()");
        });

        modelBuilder.Entity<UserBadge>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.BadgeID })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.Property(e => e.AwardedAt).HasDefaultValueSql("current_timestamp()");

            entity.HasOne(d => d.Badge).WithMany(p => p.Userbadges).HasConstraintName("Userbadges_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Userbadges).HasConstraintName("Userbadges_ibfk_1");
        });

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var currentTableName = entity.GetTableName();
            if (currentTableName != null)
            {
                entity.SetTableName(currentTableName.ToLowerInvariant());
            }
        }

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
