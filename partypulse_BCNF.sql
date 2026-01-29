
-- 1. Felhasználók 
CREATE TABLE Users (
    UserID            INT AUTO_INCREMENT PRIMARY KEY,
    Username          VARCHAR(50) UNIQUE NOT NULL,
    Email             VARCHAR(255) UNIQUE NOT NULL,
    Role              ENUM('user', 'organizer', 'admin') DEFAULT 'user' NOT NULL,
    DisplayName       VARCHAR(100),
    Bio               TEXT,
    ProfilePicture    LONGBLOB NULL,                    -- Bináris kép (max ~4-8 MB)
    ProfilePictureMime VARCHAR(30) NULL,                -- pl. "image/jpeg"
    Points            INT DEFAULT 0 NOT NULL,
    Gender            ENUM('male', 'female', 'other', 'prefer_not_to_say') NULL, -- Tinder-szerű matchhez
    BirthDate         DATE NULL,                        -- életkor szűréshez
    LookingFor        ENUM('friends', 'party_buddies', 'both') DEFAULT 'both',
    IsActive          BOOLEAN DEFAULT TRUE,
    IsVerified        BOOLEAN DEFAULT FALSE,
    LastActive        TIMESTAMP NULL,
    CreatedAt         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (Username),
    INDEX idx_email (Email),
    INDEX idx_points (Points DESC),
    INDEX idx_lastactive (LastActive DESC)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 2. Jelszó titkosítás 
-- ===========================================================================
CREATE TABLE PasswordSalts (
    UserID       INT PRIMARY KEY,
    Salt         CHAR(64) NOT NULL,        -- 16 byte random salt → 32 hex karakter
    PasswordHash CHAR(64) NOT NULL,        -- SHA256(salt + password) → 64 hex
    CreatedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================================
-- 3. Események
-- ===========================================================================
CREATE TABLE Events (
    EventID       INT AUTO_INCREMENT PRIMARY KEY,
    Title         VARCHAR(255) NOT NULL,
    Description   TEXT,
    EventDateTime DATETIME NOT NULL,
    Location      POINT NOT NULL,           -- pl. POINT(19.0402 47.4979)
    LocationName  VARCHAR(255),
    ImageFileName VARCHAR(255),
    Address       VARCHAR(255),
    TicketPrice   DECIMAL(10,2) DEFAULT 0,
    OrganizerID   INT NOT NULL,
    MusicStyle    ENUM('rock','pop','electronic','hiphop','jazz','latin','metal','house','techno','drumandbass','other') NOT NULL,
    MaxAttendees  INT NULL,
    IsPublic      BOOLEAN DEFAULT TRUE,
    CreatedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (OrganizerID) REFERENCES Users(UserID) ON DELETE RESTRICT,
    SPATIAL INDEX idx_location (Location),
    FULLTEXT INDEX ft_search (Title, Description),
    INDEX idx_datetime (EventDateTime),
    INDEX idx_music (MusicStyle)
) ENGINE=InnoDB;

-- ===========================================================================
-- 4. Részvételek 
-- ===========================================================================
CREATE TABLE Attendances (
    UserID       INT NOT NULL,
    EventID      INT NOT NULL,
    RegisteredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CheckInTime  TIMESTAMP NULL,               
    PointsEarned INT DEFAULT 0,
    Status       ENUM('going', 'checked_in', 'no_show') DEFAULT 'going',

    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================================
-- 5. Matches
-- ===========================================================================
CREATE TABLE Matches (
    MatchID     INT AUTO_INCREMENT PRIMARY KEY,
    User1ID     INT NOT NULL,
    User2ID     INT NOT NULL,
    User1Liked  BOOLEAN DEFAULT TRUE,     
    User2Liked  BOOLEAN NULL,            
    MatchedAt   TIMESTAMP NULL,           
    ChatRoomID  CHAR(36) UNIQUE NULL,     

    UNIQUE KEY uq_pair (User1ID, User2ID),
    FOREIGN KEY (User1ID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (User2ID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CHECK (User1ID < User2ID)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 6. Chat üzenetek 
-- ===========================================================================
CREATE TABLE ChatMessages (
    MessageID   BIGINT AUTO_INCREMENT PRIMARY KEY,
    RoomID      CHAR(36) NOT NULL,
    SenderID    INT NOT NULL,
    Message     TEXT NOT NULL,
    SentAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRead      BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (RoomID) REFERENCES Matches(ChatRoomID) ON DELETE CASCADE,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_room_time (RoomID, SentAt DESC),
    INDEX idx_sender (SenderID),
    INDEX idx_sentat (SentAt)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ===========================================================================
-- 7. Ranglisták 
-- ===========================================================================
CREATE TABLE Rankings (
    UserID      INT NOT NULL,
    RankType    ENUM('all_time', 'monthly') NOT NULL,
    Period      CHAR(7) DEFAULT NULL,         -- pl. "2025-12" csak monthly esetén
    Score       INT NOT NULL,
    RankPos     INT NULL,                     -- opcionálisan tárolt helyezés

    PRIMARY KEY (RankType, Period, Score DESC, UserID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================================
-- 8. Kitüntetések
-- ===========================================================================
CREATE TABLE Badges (
    BadgeID     INT AUTO_INCREMENT PRIMARY KEY,
    Name        VARCHAR(100) UNIQUE NOT NULL,
    Description TEXT,
    IconUrl     VARCHAR(512),
    Criteria    JSON NOT NULL,                
    IsActive    BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE UserBadges (
    UserID     INT NOT NULL,
    BadgeID    INT NOT NULL,
    AwardedAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (UserID, BadgeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (BadgeID) REFERENCES Badges(BadgeID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Értékelések
-- ===========================================================================
CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    EventID INT NOT NULL,
    UserID INT NOT NULL,
    Rating TINYINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_one_review_per_user (UserID, EventID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10. Kedvencek
-- ===========================================================================
CREATE TABLE EventFavorites (
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    
    INDEX idx_user (UserID),
    INDEX idx_event (EventID)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
