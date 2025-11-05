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


