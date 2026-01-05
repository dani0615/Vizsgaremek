using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PartyPulseBackend.Models;

public partial class PartypulseContext : DbContext
{
    public PartypulseContext()
    {
    }

    public PartypulseContext(DbContextOptions<PartypulseContext> options)
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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("SERVER=localhost;PORT=3306;DATABASE=partypulse;USER=root;PASSWORD=;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.EventId }).HasName("PRIMARY");

            entity.ToTable("attendances");

            entity.HasIndex(e => e.EventId, "EventID");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");
            entity.Property(e => e.EventId)
                .HasColumnType("int(11)")
                .HasColumnName("EventID");
            entity.Property(e => e.CheckInTime)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("timestamp");
            entity.Property(e => e.PointsEarned)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)");
            entity.Property(e => e.RegisteredAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'''going'''")
                .HasColumnType("enum('going','checked_in','no_show')");

            entity.HasOne(d => d.Event).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("attendances_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Attendances)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("attendances_ibfk_1");
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(e => e.BadgeId).HasName("PRIMARY");

            entity.ToTable("badges");

            entity.HasIndex(e => e.Name, "Name").IsUnique();

            entity.Property(e => e.BadgeId)
                .HasColumnType("int(11)")
                .HasColumnName("BadgeID");
            entity.Property(e => e.Description)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text");
            entity.Property(e => e.IconUrl)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Chatmessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PRIMARY");

            entity.ToTable("chatmessages");

            entity.HasIndex(e => new { e.RoomId, e.SentAt }, "idx_room_time");

            entity.HasIndex(e => e.SenderId, "idx_sender");

            entity.HasIndex(e => e.SentAt, "idx_sentat");

            entity.Property(e => e.MessageId)
                .HasColumnType("bigint(20)")
                .HasColumnName("MessageID");
            entity.Property(e => e.IsRead).HasDefaultValueSql("'0'");
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.RoomId).HasColumnName("RoomID");
            entity.Property(e => e.SenderId)
                .HasColumnType("int(11)")
                .HasColumnName("SenderID");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");

            entity.HasOne(d => d.Room).WithMany(p => p.Chatmessages)
                .HasPrincipalKey(p => p.ChatRoomId)
                .HasForeignKey(d => d.RoomId)
                .HasConstraintName("chatmessages_ibfk_1");

            entity.HasOne(d => d.Sender).WithMany(p => p.Chatmessages)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("chatmessages_ibfk_2");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PRIMARY");

            entity.ToTable("events");

            entity.HasIndex(e => e.OrganizerId, "OrganizerID");

            entity.HasIndex(e => new { e.Title, e.Description }, "ft_search");

            entity.HasIndex(e => e.EventDateTime, "idx_datetime");

            entity.HasIndex(e => e.MusicStyle, "idx_music");

            entity.Property(e => e.EventId)
                .HasColumnType("int(11)")
                .HasColumnName("EventID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.Description)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text");
            entity.Property(e => e.EventDateTime).HasColumnType("datetime");
            entity.Property(e => e.IsPublic).HasDefaultValueSql("'1'");
            entity.Property(e => e.LocationName)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'");
            entity.Property(e => e.MaxAttendees)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)");
            entity.Property(e => e.MusicStyle).HasColumnType("enum('rock','pop','electronic','hiphop','jazz','latin','metal','house','techno','drumandbass','other')");
            entity.Property(e => e.OrganizerId)
                .HasColumnType("int(11)")
                .HasColumnName("OrganizerID");
            entity.Property(e => e.TicketPrice)
                .HasPrecision(10)
                .HasDefaultValueSql("'0.00'");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("events_ibfk_1");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PRIMARY");

            entity.ToTable("matches");

            entity.HasIndex(e => e.ChatRoomId, "ChatRoomID").IsUnique();

            entity.HasIndex(e => e.User2Id, "User2ID");

            entity.HasIndex(e => new { e.User1Id, e.User2Id }, "uq_pair").IsUnique();

            entity.Property(e => e.MatchId)
                .HasColumnType("int(11)")
                .HasColumnName("MatchID");
            entity.Property(e => e.ChatRoomId)
                .IsRequired()
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("ChatRoomID");
            entity.Property(e => e.MatchedAt)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("timestamp");
            entity.Property(e => e.User1Id)
                .HasColumnType("int(11)")
                .HasColumnName("User1ID");
            entity.Property(e => e.User1Liked).HasDefaultValueSql("'1'");
            entity.Property(e => e.User2Id)
                .HasColumnType("int(11)")
                .HasColumnName("User2ID");
            entity.Property(e => e.User2Liked).HasDefaultValueSql("'NULL'");

            entity.HasOne(d => d.User1).WithMany(p => p.MatchUser1s)
                .HasForeignKey(d => d.User1Id)
                .HasConstraintName("matches_ibfk_1");

            entity.HasOne(d => d.User2).WithMany(p => p.MatchUser2s)
                .HasForeignKey(d => d.User2Id)
                .HasConstraintName("matches_ibfk_2");
        });

        modelBuilder.Entity<Passwordsalt>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("passwordsalts");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(64)
                .IsFixedLength();
            entity.Property(e => e.Salt)
                .HasMaxLength(32)
                .IsFixedLength();

            entity.HasOne(d => d.User).WithOne(p => p.Passwordsalt)
                .HasForeignKey<Passwordsalt>(d => d.UserId)
                .HasConstraintName("passwordsalts_ibfk_1");
        });

        modelBuilder.Entity<Ranking>(entity =>
        {
            entity.HasKey(e => new { e.RankType, e.Period, e.Score, e.UserId }).HasName("PRIMARY");

            entity.ToTable("rankings");

            entity.HasIndex(e => e.UserId, "UserID");

            entity.Property(e => e.RankType).HasColumnType("enum('all_time','monthly')");
            entity.Property(e => e.Period)
                .HasMaxLength(7)
                .IsFixedLength();
            entity.Property(e => e.Score).HasColumnType("int(11)");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");
            entity.Property(e => e.RankPos)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)");

            entity.HasOne(d => d.User).WithMany(p => p.Rankings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("rankings_ibfk_1");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PRIMARY");

            entity.ToTable("reviews");

            entity.HasIndex(e => e.EventId, "EventID");

            entity.HasIndex(e => new { e.UserId, e.EventId }, "uq_one_review_per_user").IsUnique();

            entity.Property(e => e.ReviewId)
                .HasColumnType("int(11)")
                .HasColumnName("ReviewID");
            entity.Property(e => e.Comment)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.EventId)
                .HasColumnType("int(11)")
                .HasColumnName("EventID");
            entity.Property(e => e.Rating).HasColumnType("tinyint(4)");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");

            entity.HasOne(d => d.Event).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("reviews_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("reviews_ibfk_2");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.HasIndex(e => e.Username, "Username").IsUnique();

            entity.HasIndex(e => e.Email, "idx_email");

            entity.HasIndex(e => e.LastActive, "idx_lastactive");

            entity.HasIndex(e => e.Points, "idx_points");

            entity.HasIndex(e => e.Username, "idx_username");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");
            entity.Property(e => e.Bio)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text");
            entity.Property(e => e.BirthDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("date");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.DisplayName)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'");
            entity.Property(e => e.Gender)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("enum('male','female','other','prefer_not_to_say')");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.IsVerified).HasDefaultValueSql("'0'");
            entity.Property(e => e.LastActive)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("timestamp");
            entity.Property(e => e.LookingFor)
                .HasDefaultValueSql("'''both'''")
                .HasColumnType("enum('friends','party_buddies','both')");
            entity.Property(e => e.Points).HasColumnType("int(11)");
            entity.Property(e => e.ProfilePicture).HasDefaultValueSql("'NULL'");
            entity.Property(e => e.ProfilePictureMime)
                .HasMaxLength(30)
                .HasDefaultValueSql("'NULL'");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        modelBuilder.Entity<Userbadge>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BadgeId }).HasName("PRIMARY");

            entity.ToTable("userbadges");

            entity.HasIndex(e => e.BadgeId, "BadgeID");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("UserID");
            entity.Property(e => e.BadgeId)
                .HasColumnType("int(11)")
                .HasColumnName("BadgeID");
            entity.Property(e => e.AwardedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp");

            entity.HasOne(d => d.Badge).WithMany(p => p.Userbadges)
                .HasForeignKey(d => d.BadgeId)
                .HasConstraintName("userbadges_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Userbadges)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("userbadges_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
