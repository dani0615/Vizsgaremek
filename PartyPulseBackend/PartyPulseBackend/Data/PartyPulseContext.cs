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

    public virtual DbSet<attendance> Attendances { get; set; }

    public virtual DbSet<badge> Badges { get; set; }

    public virtual DbSet<chatmessage> Chatmessages { get; set; }

    public virtual DbSet<@event> Events { get; set; }

    public virtual DbSet<eventfavorite> Eventfavorites { get; set; }

    public virtual DbSet<match> Matches { get; set; }

    public virtual DbSet<passwordsalt> Passwordsalts { get; set; }

    public virtual DbSet<ranking> Rankings { get; set; }

    public virtual DbSet<review> Reviews { get; set; }

    public virtual DbSet<user> Users { get; set; }

    public virtual DbSet<userbadge> Userbadges { get; set; }

   

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<attendance>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.EventID }).HasName("PRIMARY");

            entity.Property(e => e.CheckInTime).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.PointsEarned).HasDefaultValueSql("'0'");
            entity.Property(e => e.RegisteredAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.Status).HasDefaultValueSql("'''going'''");

            entity.HasOne(d => d.Event).WithMany(p => p.attendances).HasConstraintName("attendances_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.attendances).HasConstraintName("attendances_ibfk_1");
        });

        modelBuilder.Entity<badge>(entity =>
        {
            entity.HasKey(e => e.BadgeID).HasName("PRIMARY");

            entity.Property(e => e.Description).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IconUrl).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<chatmessage>(entity =>
        {
            entity.HasKey(e => e.MessageID).HasName("PRIMARY");

            entity.Property(e => e.IsRead).HasDefaultValueSql("'0'");
            entity.Property(e => e.SentAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Room).WithMany(p => p.chatmessages)
                .HasPrincipalKey(p => p.ChatRoomID)
                .HasForeignKey(d => d.RoomID)
                .HasConstraintName("chatmessages_ibfk_1");

            entity.HasOne(d => d.Sender).WithMany(p => p.chatmessages).HasConstraintName("chatmessages_ibfk_2");
        });

        modelBuilder.Entity<@event>(entity =>
        {
            entity.HasKey(e => e.EventID).HasName("PRIMARY");

            entity.Property(e => e.Address).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.Description).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.ImageFileName).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsPublic).HasDefaultValueSql("'1'");
            entity.Property(e => e.LocationName).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.MaxAttendees).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.TicketPrice).HasDefaultValueSql("'0.00'");

            entity.HasOne(d => d.Organizer).WithMany(p => p.events)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("events_ibfk_1");
        });

        modelBuilder.Entity<eventfavorite>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.EventID }).HasName("PRIMARY");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Event).WithMany(p => p.eventfavorites).HasConstraintName("eventfavorites_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.eventfavorites).HasConstraintName("eventfavorites_ibfk_1");
        });

        modelBuilder.Entity<match>(entity =>
        {
            entity.HasKey(e => e.MatchID).HasName("PRIMARY");

            entity.Property(e => e.ChatRoomID).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.MatchedAt).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.User1Liked).HasDefaultValueSql("'1'");
            entity.Property(e => e.User2Liked).HasDefaultValueSql("'NULL'");

            entity.HasOne(d => d.User1).WithMany(p => p.matchUser1s).HasConstraintName("matches_ibfk_1");

            entity.HasOne(d => d.User2).WithMany(p => p.matchUser2s).HasConstraintName("matches_ibfk_2");
        });

        modelBuilder.Entity<passwordsalt>(entity =>
        {
            entity.HasKey(e => e.UserID).HasName("PRIMARY");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");
            entity.Property(e => e.PasswordHash).IsFixedLength();
            entity.Property(e => e.Salt).IsFixedLength();

            entity.HasOne(d => d.User).WithOne(p => p.passwordsalt).HasConstraintName("passwordsalts_ibfk_1");
        });

        modelBuilder.Entity<ranking>(entity =>
        {
            entity.HasKey(e => new { e.RankType, e.Period, e.Score, e.UserID }).HasName("PRIMARY");

            entity.Property(e => e.Period).IsFixedLength();
            entity.Property(e => e.RankPos).HasDefaultValueSql("'NULL'");

            entity.HasOne(d => d.User).WithMany(p => p.rankings).HasConstraintName("rankings_ibfk_1");
        });

        modelBuilder.Entity<review>(entity =>
        {
            entity.HasKey(e => e.ReviewID).HasName("PRIMARY");

            entity.Property(e => e.Comment).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Event).WithMany(p => p.reviews).HasConstraintName("reviews_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.reviews).HasConstraintName("reviews_ibfk_2");
        });

        modelBuilder.Entity<user>(entity =>
        {
            entity.HasKey(e => e.UserID).HasName("PRIMARY");

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

        modelBuilder.Entity<userbadge>(entity =>
        {
            entity.HasKey(e => new { e.UserID, e.BadgeID }).HasName("PRIMARY");

            entity.Property(e => e.AwardedAt).HasDefaultValueSql("'current_timestamp()'");

            entity.HasOne(d => d.Badge).WithMany(p => p.userbadges).HasConstraintName("userbadges_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.userbadges).HasConstraintName("userbadges_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
