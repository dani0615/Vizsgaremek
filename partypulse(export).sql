-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 07. 12:18
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `partypulse`
--
CREATE DATABASE IF NOT EXISTS `partypulse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `partypulse`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `attendances`
--

DROP TABLE IF EXISTS `attendances`;
CREATE TABLE `attendances` (
  `UserID` int(11) NOT NULL,
  `EventID` int(11) NOT NULL,
  `RegisteredAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `CheckInTime` timestamp NULL DEFAULT NULL,
  `PointsEarned` int(11) DEFAULT 0,
  `Status` enum('going','checked_in','no_show') DEFAULT 'going'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `attendances`
--

INSERT INTO `attendances` (`UserID`, `EventID`, `RegisteredAt`, `CheckInTime`, `PointsEarned`, `Status`) VALUES
(5, 1, '2026-01-07 10:52:55', NULL, 0, 'going'),
(6, 2, '2026-01-07 10:52:55', NULL, 0, 'going'),
(7, 1, '2026-01-07 10:52:55', NULL, 50, 'checked_in'),
(8, 3, '2026-01-07 10:52:55', NULL, 10, 'checked_in');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `badges`
--

DROP TABLE IF EXISTS `badges`;
CREATE TABLE `badges` (
  `BadgeID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `IconUrl` varchar(512) DEFAULT NULL,
  `Criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Criteria`)),
  `IsActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `badges`
--

INSERT INTO `badges` (`BadgeID`, `Name`, `Description`, `IconUrl`, `Criteria`, `IsActive`) VALUES
(1, 'Éjszakai Bagoly', 'Aki részt vett legalább 5 éjszakai eseményen.', 'owl_icon.png', '{\"event_count\": 5, \"time\": \"night\"}', 1),
(2, 'VIP Szervező', 'Szervezett legalább 10 sikeres eseményt.', 'vip_icon.png', '{\"organized_count\": 10}', 1),
(3, 'Borsodi Betyár', 'Járt Miskolcon, Kazincbarcikán és Ózdon is eseményen.', 'betyar.png', '{\"locations\": [\"Miskolc\", \"Kazincbarcika\", \"Ozd\"]}', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `chatmessages`
--

DROP TABLE IF EXISTS `chatmessages`;
CREATE TABLE `chatmessages` (
  `MessageID` bigint(20) NOT NULL,
  `RoomID` char(36) NOT NULL,
  `SenderID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `SentAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `chatmessages`
--

INSERT INTO `chatmessages` (`MessageID`, `RoomID`, `SenderID`, `Message`, `SentAt`, `IsRead`) VALUES
(1, 'uuid-room-1234-5678-miskolc-love', 5, 'Szia! Láttam mész a Tokaji borfesztiválra te is. :)', '2026-02-14 17:35:00', 1),
(2, 'uuid-room-1234-5678-miskolc-love', 6, 'Szia Peti! Igen, imádom a Furmintot. Te miskolci vagy?', '2026-02-14 17:40:00', 1),
(3, 'uuid-room-1234-5678-miskolc-love', 5, 'Persze, egyetemre járok. Összefutunk majd Tokajban egy koccintásra?', '2026-02-14 17:42:00', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `EventID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `EventDateTime` datetime NOT NULL,
  `Location` point NOT NULL,
  `LocationName` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `TicketPrice` decimal(10,2) DEFAULT 0.00,
  `OrganizerID` int(11) NOT NULL,
  `MusicStyle` enum('rock','pop','electronic','hiphop','jazz','latin','metal','house','techno','drumandbass','other') NOT NULL,
  `MaxAttendees` int(11) DEFAULT NULL,
  `IsPublic` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `events`
--

INSERT INTO `events` (`EventID`, `Title`, `Description`, `EventDateTime`, `Location`, `LocationName`, `Address`, `TicketPrice`, `OrganizerID`, `MusicStyle`, `MaxAttendees`, `IsPublic`, `CreatedAt`) VALUES
(1, 'Tankcsapda Tribute - Péntek este', 'A legjobb Tankcsapda dalok élőben a Helynekem színpadán! Előzenekar: BAZ-Rockers.', '2026-05-15 20:00:00', 0x000000000101000000f1f44a5986c83440cdcccccccc0c4840, 'Helynekem', '3525 Miskolc, Széchenyi u. 30.', 2500.00, 3, 'rock', 300, 1, '2026-01-07 10:52:55'),
(2, 'Tokaji Bor és Jazz Hétvége', 'Kóstold meg a legfinomabb aszúkat lágy jazz zene kíséretében a Fesztiválkatlanban.', '2026-06-20 18:00:00', 0x00000000010100000044696ff085693540711b0de02d104840, 'Tokaj Fesztiválkatlan', '3910 Tokaj, Bodrogkeresztúri út 60.', 4990.00, 4, 'jazz', 1500, 1, '2026-01-07 10:52:55'),
(3, 'Miskolci Egyetemi Napok (MEN) - Warmup', 'Az év legnagyobb egyetemi bulija előtt bemelegítünk a Rockwell Klubban!', '2026-04-10 22:00:00', 0x000000000101000000dcd7817346c434401895d409680a4840, 'Miskolci Egyetemváros', '3515 Miskolc, Egyetem út', 1500.00, 3, 'electronic', 2000, 1, '2026-01-07 10:52:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `matches`
--

DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches` (
  `MatchID` int(11) NOT NULL,
  `User1ID` int(11) NOT NULL,
  `User2ID` int(11) NOT NULL,
  `User1Liked` tinyint(1) DEFAULT 1,
  `User2Liked` tinyint(1) DEFAULT NULL,
  `MatchedAt` timestamp NULL DEFAULT NULL,
  `ChatRoomID` char(36) DEFAULT NULL
) ;

--
-- A tábla adatainak kiíratása `matches`
--

INSERT INTO `matches` (`MatchID`, `User1ID`, `User2ID`, `User1Liked`, `User2Liked`, `MatchedAt`, `ChatRoomID`) VALUES
(1, 5, 6, 1, 1, '2026-02-14 17:30:00', 'uuid-room-1234-5678-miskolc-love'),
(2, 7, 8, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `passwordsalts`
--

DROP TABLE IF EXISTS `passwordsalts`;
CREATE TABLE `passwordsalts` (
  `UserID` int(11) NOT NULL,
  `Salt` char(32) NOT NULL,
  `PasswordHash` char(64) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `passwordsalts`
--

INSERT INTO `passwordsalts` (`UserID`, `Salt`, `PasswordHash`, `CreatedAt`) VALUES
(1, '92f4c25d058e48a5af71121e14409215', 'b9c42074082c58c634f46a5787d36bc4913e630ae71a4ad55f86cca6dec9a56f', '2026-01-07 09:53:44'),
(2, 'randomsalt1111111111111111111111', 'dummyhashadmin1234567890abcdef1234567890abcdef1234567890abcdef', '2026-01-07 10:52:55'),
(3, 'randomsalt2222222222222222222222', 'dummyhashhelynekem1234567890abcdef1234567890abcdef1234567890ab', '2026-01-07 10:52:55'),
(4, 'randomsalt3333333333333333333333', 'dummyhashtokaj1234567890abcdef1234567890abcdef1234567890abcdef', '2026-01-07 10:52:55'),
(5, 'randomsalt4444444444444444444444', 'dummyhashpeti1234567890abcdef1234567890abcdef1234567890abcdef1', '2026-01-07 10:52:55'),
(6, 'randomsalt5555555555555555555555', 'dummyhashlilla1234567890abcdef1234567890abcdef1234567890abcdef', '2026-01-07 10:52:55'),
(7, 'randomsalt6666666666666666666666', 'dummyhashzoli1234567890abcdef1234567890abcdef1234567890abcdef1', '2026-01-07 10:52:55'),
(8, 'randomsalt7777777777777777777777', 'dummyhashreka1234567890abcdef1234567890abcdef1234567890abcdef1', '2026-01-07 10:52:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rankings`
--

DROP TABLE IF EXISTS `rankings`;
CREATE TABLE `rankings` (
  `UserID` int(11) NOT NULL,
  `RankType` enum('all_time','monthly') NOT NULL,
  `Period` char(7) NOT NULL,
  `Score` int(11) NOT NULL,
  `RankPos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `rankings`
--

INSERT INTO `rankings` (`UserID`, `RankType`, `Period`, `Score`, `RankPos`) VALUES
(3, 'all_time', '', 1500, 1),
(7, 'monthly', '2026-05', 150, 2),
(8, 'monthly', '2026-05', 300, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `ReviewID` int(11) NOT NULL,
  `EventID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Rating` tinyint(4) NOT NULL CHECK (`Rating` between 1 and 5),
  `Comment` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `reviews`
--

INSERT INTO `reviews` (`ReviewID`, `EventID`, `UserID`, `Rating`, `Comment`, `CreatedAt`) VALUES
(1, 1, 7, 5, 'Hatalmas zúzás volt, a sör is hideg volt! Csak a beengedés volt kicsit lassú a sétáló utcánál.', '2026-01-07 10:52:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userbadges`
--

DROP TABLE IF EXISTS `userbadges`;
CREATE TABLE `userbadges` (
  `UserID` int(11) NOT NULL,
  `BadgeID` int(11) NOT NULL,
  `AwardedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `userbadges`
--

INSERT INTO `userbadges` (`UserID`, `BadgeID`, `AwardedAt`) VALUES
(3, 2, '2026-01-07 10:52:55'),
(7, 1, '2026-01-07 10:52:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Role` enum('user','organizer','admin') NOT NULL DEFAULT 'user',
  `DisplayName` varchar(100) DEFAULT NULL,
  `Bio` text DEFAULT NULL,
  `ProfilePicture` longblob DEFAULT NULL,
  `ProfilePictureMime` varchar(30) DEFAULT NULL,
  `Points` int(11) NOT NULL DEFAULT 0,
  `Gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `LookingFor` enum('friends','party_buddies','both') DEFAULT 'both',
  `IsActive` tinyint(1) DEFAULT 1,
  `IsVerified` tinyint(1) DEFAULT 0,
  `LastActive` timestamp NULL DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Email`, `Role`, `DisplayName`, `Bio`, `ProfilePicture`, `ProfilePictureMime`, `Points`, `Gender`, `BirthDate`, `LookingFor`, `IsActive`, `IsVerified`, `LastActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'string', 'haluskad@kkszki.hu', 'user', NULL, NULL, NULL, NULL, 0, NULL, NULL, 'both', 1, 1, NULL, '2026-01-07 09:53:44', '2026-01-07 09:54:04'),
(2, 'admin_borsod', 'admin@baz-party.hu', 'admin', 'Rendszergazda', 'A Borsod Party app karbantartója.', NULL, NULL, 9999, 'male', '1990-01-01', 'both', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(3, 'helynekem_klub', 'info@helynekem.hu', 'organizer', 'Helynekem Miskolc', 'Miskolc kulturális romkocsmája és koncerthelyszíne.', NULL, NULL, 500, 'prefer_not_to_say', '2010-05-20', 'both', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(4, 'tokaj_fesztival', 'szervezes@tokaj.hu', 'organizer', 'Tokaj Fesztiválkatlan', 'Nagyszabású koncertek a Bodrog partján.', NULL, NULL, 450, 'prefer_not_to_say', '2014-06-01', 'both', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(5, 'miskolci_peti', 'peti98@gmail.com', 'user', 'Péter', 'Miskolci egyetemista, szeretem a rockot és a söröket. Miskolc belváros.', NULL, NULL, 120, 'male', '1998-03-12', '', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(6, 'lilla_girly', 'lilla.kiss@freemail.hu', 'user', 'Lilla', 'Sárospataki lány, hétvégén általában Miskolcon bulizom. Imádom a jazzt és a bort.', NULL, NULL, 210, 'female', '2000-07-15', '', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(7, 'kazinc_zoli', 'zoli_metal@citromail.hu', 'user', 'Zoltán', 'Kazincbarcikai rocker. Tankcsapda örök! Koncerttársat keresek.', NULL, NULL, 80, 'male', '1995-11-02', 'friends', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55'),
(8, 'party_rekus', 'reka02@gmail.com', 'user', 'Réka', 'Csak a techno és a house! MEN-re valaki?', NULL, NULL, 300, 'female', '2002-01-28', 'party_buddies', 1, 0, NULL, '2026-01-07 10:52:55', '2026-01-07 10:52:55');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`UserID`,`EventID`),
  ADD KEY `EventID` (`EventID`);

--
-- A tábla indexei `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`BadgeID`),
  ADD UNIQUE KEY `Name` (`Name`);

--
-- A tábla indexei `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `idx_room_time` (`RoomID`,`SentAt`),
  ADD KEY `idx_sender` (`SenderID`),
  ADD KEY `idx_sentat` (`SentAt`);

--
-- A tábla indexei `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `OrganizerID` (`OrganizerID`),
  ADD SPATIAL KEY `idx_location` (`Location`),
  ADD KEY `idx_datetime` (`EventDateTime`),
  ADD KEY `idx_music` (`MusicStyle`);
ALTER TABLE `events` ADD FULLTEXT KEY `ft_search` (`Title`,`Description`);

--
-- A tábla indexei `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`MatchID`),
  ADD UNIQUE KEY `uq_pair` (`User1ID`,`User2ID`),
  ADD UNIQUE KEY `ChatRoomID` (`ChatRoomID`),
  ADD KEY `User2ID` (`User2ID`);

--
-- A tábla indexei `passwordsalts`
--
ALTER TABLE `passwordsalts`
  ADD PRIMARY KEY (`UserID`);

--
-- A tábla indexei `rankings`
--
ALTER TABLE `rankings`
  ADD PRIMARY KEY (`RankType`,`Period`,`Score`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`ReviewID`),
  ADD UNIQUE KEY `uq_one_review_per_user` (`UserID`,`EventID`),
  ADD KEY `EventID` (`EventID`);

--
-- A tábla indexei `userbadges`
--
ALTER TABLE `userbadges`
  ADD PRIMARY KEY (`UserID`,`BadgeID`),
  ADD KEY `BadgeID` (`BadgeID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `idx_username` (`Username`),
  ADD KEY `idx_email` (`Email`),
  ADD KEY `idx_points` (`Points`),
  ADD KEY `idx_lastactive` (`LastActive`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `badges`
--
ALTER TABLE `badges`
  MODIFY `BadgeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `chatmessages`
--
ALTER TABLE `chatmessages`
  MODIFY `MessageID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `EventID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `matches`
--
ALTER TABLE `matches`
  MODIFY `MatchID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD CONSTRAINT `chatmessages_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `matches` (`ChatRoomID`) ON DELETE CASCADE,
  ADD CONSTRAINT `chatmessages_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`OrganizerID`) REFERENCES `users` (`UserID`);

--
-- Megkötések a táblához `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`User1ID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`User2ID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `passwordsalts`
--
ALTER TABLE `passwordsalts`
  ADD CONSTRAINT `passwordsalts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `rankings`
--
ALTER TABLE `rankings`
  ADD CONSTRAINT `rankings_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `userbadges`
--
ALTER TABLE `userbadges`
  ADD CONSTRAINT `userbadges_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `userbadges_ibfk_2` FOREIGN KEY (`BadgeID`) REFERENCES `badges` (`BadgeID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
