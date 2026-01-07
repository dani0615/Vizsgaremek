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

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<Passwordsalt> Passwordsalts { get; set; }

    public virtual DbSet<Ranking> Rankings { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userbadge> Userbadges { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.EventId }).HasName("PRIMARY");

            entity.Property(e => e.CheckInTime).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.PointsEarned).HasDefaultValueSql("'0'");
            entity.Property(e => e.RegisteredAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.Status).HasDefaultValueSql("'''going'''");

            entity.HasOne(d => d.Event).WithMany(p => p.Attendances).HasConstraintName("attendances_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Attendances).HasConstraintName("attendances_ibfk_1");
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(e => e.BadgeId).HasName("PRIMARY");

            entity.Property(e => e.Description).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IconUrl).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<Chatmessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PRIMARY");

            entity.Property(e => e.IsRead).HasDefaultValueSql("'0'");
            entity.Property(e => e.SentAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Room).WithMany(p => p.Chatmessages)
                .HasPrincipalKey(p => p.ChatRoomId)
                .HasForeignKey(d => d.RoomId)
                .HasConstraintName("chatmessages_ibfk_1");

            entity.HasOne(d => d.Sender).WithMany(p => p.Chatmessages).HasConstraintName("chatmessages_ibfk_2");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PRIMARY");

            entity.Property(e => e.Address).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.Description).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsPublic).HasDefaultValueSql("'1'");
            entity.Property(e => e.LocationName).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.MaxAttendees).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.TicketPrice).HasDefaultValueSql("'0.00'");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Events)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("events_ibfk_1");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PRIMARY");

            entity.Property(e => e.ChatRoomId).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.MatchedAt).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.User1Liked).HasDefaultValueSql("'1'");
            entity.Property(e => e.User2Liked).HasDefaultValueSql("'NULL'");

            entity.HasOne(d => d.User1).WithMany(p => p.MatchUser1s).HasConstraintName("matches_ibfk_1");

            entity.HasOne(d => d.User2).WithMany(p => p.MatchUser2s).HasConstraintName("matches_ibfk_2");
        });

        modelBuilder.Entity<Passwordsalt>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.PasswordHash).IsFixedLength();
            entity.Property(e => e.Salt).IsFixedLength();

            entity.HasOne(d => d.User).WithOne(p => p.Passwordsalt).HasConstraintName("passwordsalts_ibfk_1");
        });

        modelBuilder.Entity<Ranking>(entity =>
        {
            entity.HasKey(e => new { e.RankType, e.Period, e.Score, e.UserId }).HasName("PRIMARY");

            entity.Property(e => e.Period).IsFixedLength();
            entity.Property(e => e.RankPos).HasDefaultValueSql("'NULL'");

            entity.HasOne(d => d.User).WithMany(p => p.Rankings).HasConstraintName("rankings_ibfk_1");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PRIMARY");

            entity.Property(e => e.Comment).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Event).WithMany(p => p.Reviews).HasConstraintName("reviews_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews).HasConstraintName("reviews_ibfk_2");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.Property(e => e.Bio).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.BirthDate).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.DisplayName).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.Gender).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.IsVerified).HasDefaultValueSql("'0'");
            entity.Property(e => e.LastActive).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.LookingFor).HasDefaultValueSql("'''both'''");
            entity.Property(e => e.ProfilePicture).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.ProfilePictureMime).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.Role).HasDefaultValueSql("'''user'''");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'");
        });

        modelBuilder.Entity<Userbadge>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BadgeId }).HasName("PRIMARY");

            entity.Property(e => e.AwardedAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Badge).WithMany(p => p.Userbadges).HasConstraintName("userbadges_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Userbadges).HasConstraintName("userbadges_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
