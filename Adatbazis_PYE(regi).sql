/* PartyPulse V0.1 */ 

-- Felhasználók táblája
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,  -- For bcrypt hash (jelszó tárolása)
    ProfilePictureUrl VARCHAR(255),
    Points INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Események táblája
CREATE TABLE Events (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DateTime DATETIME NOT NULL,
    Location JSON,  -- JSON for coordinates, e.g., {"lat": 47.4979, "lng": 19.0402} (helyszín koordinátái)
    TicketPrice DECIMAL(10, 2),
    OrganizerID INT NOT NULL,
    MusicStyle ENUM('rock', 'pop', 'electronic', 'hiphop', 'jazz', 'other') NOT NULL,  -- zenei stílusok 
    FOREIGN KEY (OrganizerID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Részvételek táblája
CREATE TABLE Attendances (
    ID INT AUTO_INCREMENT PRIMARY KEY, 
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    CheckInTime TIMESTAMP, 
    PointsEarned INT DEFAULT 0,
    UNIQUE KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE,  
    FOREIGN KEY (EventID) REFERENCES Events(ID) ON DELETE CASCADE   
);

-- Matchelések táblája (barátok/találkozások)
CREATE TABLE Matches (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User1ID INT NOT NULL,
    User2ID INT NOT NULL,
    MatchedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ChatRoomID VARCHAR(255) UNIQUE NOT NULL,  -- Egyedi chat szoba azonosító, egyéni UUID
    FOREIGN KEY (User1ID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (User2ID) REFERENCES Users(ID) ON DELETE CASCADE 
);

-- Chatüzenetek táblája (üzenetek) , változhat a tábla szerkezete , az üzenet kezelése és titkosítása miatt.
CREATE TABLE Chats (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    RoomID VARCHAR(255) NOT NULL, 
    SenderID INT NOT NULL, 
    Message TEXT NOT NULL, 
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomID) REFERENCES Matches(ChatRoomID) ON DELETE CASCADE,
    FOREIGN KEY (SenderID) REFERENCES Users(ID) ON DELETE CASCADE
);
-- Particionálás a Timestamp szerint, példa MySQL 8+ esetén:
-- PARTITION BY RANGE (UNIX_TIMESTAMP(Timestamp)) (PARTITION p0 VALUES LESS THAN (UNIX_TIMESTAMP('2025-01-01')), ...); (szükséges a skálázhatóság érdekében.)

-- Rangsorok táblája
CREATE TABLE Rankings (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    RankType ENUM('monthly', 'all-time') NOT NULL,  
    Score INT NOT NULL, 
    UNIQUE KEY (UserID, RankType), 
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE 
);

-- Kitűzők táblája
CREATE TABLE Badges (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Criteria JSON  -- JSON for rules, e.g., {"points_required": 1000} (pontok szükségesek a badge megszerzéséhez)
);

-- Felhasználók és Kitűzők közötti kapcsolat táblája 
CREATE TABLE UsersBadges (
    UserID INT NOT NULL,
    BadgeID INT NOT NULL,
    AwardedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, BadgeID),
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (BadgeID) REFERENCES Badges(ID) ON DELETE CASCADE
);

-- Értékelések táblája
CREATE TABLE Reviews (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EventID INT NOT NULL,
    UserID INT NOT NULL,
    Rating TINYINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    FOREIGN KEY (EventID) REFERENCES Events(ID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
);

