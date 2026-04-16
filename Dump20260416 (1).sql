-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: partypulse-gpt81221-c0c6.f.aivencloud.com    Database: partypulse
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '135cd2be-2078-11f1-a17a-ba7d93449684:1-34,
1495ea4f-1fe9-11f1-ab05-9e62cb7cf3f3:1-94,
ab26eb3b-210c-11f1-bc4a-a6976819a93e:1-126';

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `UserID` int NOT NULL,
  `EventID` int NOT NULL,
  `RegisteredAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CheckInTime` timestamp NULL DEFAULT NULL,
  `PointsEarned` int DEFAULT '0',
  `Status` enum('going','checked_in','no_show') COLLATE utf8mb4_hungarian_ci DEFAULT 'going',
  PRIMARY KEY (`UserID`,`EventID`),
  KEY `EventID` (`EventID`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,1,'2026-02-26 08:47:26',NULL,0,'going'),(1,2,'2026-03-26 08:06:04',NULL,30,'going'),(1,3,'2026-03-30 08:55:07',NULL,5,'going'),(2,1,'2026-03-17 20:35:49',NULL,0,'going'),(2,2,'2026-03-17 20:35:14',NULL,0,'going'),(8,1,'2026-03-17 20:24:57',NULL,0,'going'),(8,3,'2026-03-17 20:25:00',NULL,0,'going'),(9,1,'2026-03-17 20:37:45',NULL,0,'going');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badges` (
  `BadgeID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Description` text COLLATE utf8mb4_hungarian_ci,
  `IconUrl` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `Criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`BadgeID`),
  UNIQUE KEY `Name` (`Name`),
  CONSTRAINT `badges_chk_1` CHECK (json_valid(`Criteria`))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badges`
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
INSERT INTO `badges` VALUES (1,'Newcomer','ÃœdvÃ¶zlÃ¼nk a PartyPulse kÃ¶zÃ¶ssÃ©gben!','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858004/Newcomer_badge_vcujay.png','{\"type\": \"registration\"}',1),(2,'5 EsemÃ©ny','MÃ¡r 5 esemÃ©nyen rÃ©szt vettÃ©l.','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858000/5Events_badge_artsgy.png','{\"type\": \"attendance\", \"min\": 5}',1),(3,'10 EsemÃ©ny','Igazi partifecske vagy! (10 esemÃ©ny)','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858005/10Events_badge_a1ntc7.png','{\"type\": \"attendance\", \"min\": 10}',1),(4,'1 HÃ³napos','1 hÃ³napja tagja vagy a kÃ¶zÃ¶ssÃ©gnek.','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858002/1Month_badge_jvc8ls.png','{\"type\": \"age\", \"months\": 1}',1),(5,'6 HÃ³napos','6 hÃ³napja bulizol velÃ¼nk!','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858001/6Month_badge_kvef9e.png','{\"type\": \"age\", \"months\": 6}',1),(6,'1 Ã‰ves','Egy teljes Ã©ve a csapat tagja vagy!','https://res.cloudinary.com/dwgiehe3s/image/upload/v1774858001/1Year_Badge_t7mcal.png','{\"type\": \"age\", \"years\": 1}',1);
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatmessages`
--

DROP TABLE IF EXISTS `chatmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatmessages` (
  `MessageID` bigint NOT NULL AUTO_INCREMENT,
  `MatchID` int NOT NULL,
  `SenderID` int NOT NULL,
  `EncryptedMessage` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `EncryptionIV` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SentAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsRead` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`MessageID`),
  KEY `idx_match_time` (`MatchID`,`SentAt`),
  KEY `idx_sender` (`SenderID`),
  KEY `idx_sentat` (`SentAt`),
  CONSTRAINT `chatmessages_ibfk_1` FOREIGN KEY (`MatchID`) REFERENCES `matches` (`MatchID`) ON DELETE CASCADE,
  CONSTRAINT `chatmessages_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatmessages`
--

LOCK TABLES `chatmessages` WRITE;
/*!40000 ALTER TABLE `chatmessages` DISABLE KEYS */;
INSERT INTO `chatmessages` VALUES (1,1,1,'mumOjlgar/O0JLicjnnLsw==','FwzbXii09PdXW/s1RUHv1A==','2026-03-16 17:05:11',1),(2,1,8,'/WzpcPJ5u5XHA1hdka145g==','DxLktUoQkoW6Nl2OLC1n/g==','2026-03-16 17:05:38',1),(3,1,8,'8CUHaHRBFaRsM3BXur8eQQ==','02U10mRDFe9yUK2M8CjEGw==','2026-03-16 17:05:44',1),(4,1,1,'nsnRg5Uwk0KvBm3o5unWrg==','SIJxB/wLeJzEWu7Y3IAcJg==','2026-03-16 17:06:39',1),(5,1,1,'3HV/ik6rE6KsnRPMAVjtCw==','nu8XP6AgGOGiYyLoYnDXKQ==','2026-03-16 17:06:47',1),(6,1,1,'nBG7hbaySeETnIPaWfalfw==','JvL5iPREVCAcBlLnuOhiYQ==','2026-03-17 10:25:39',1),(7,1,1,'SL5+dmCIQhk70TgoCoSfrQ==','sM0Dt0UzJERgTxN08iJ29w==','2026-03-17 10:25:44',1),(8,6,2,'Si/kjUUbKLAWupqE1BaRPQ==','jyu8m47TerBhI6+HdiDRRw==','2026-03-17 20:38:43',1),(9,6,9,'tw3WGXqLciVCPZROqm5nOA==','0AMHUTgnjbQA0UEHj4xquw==','2026-03-17 20:38:53',1),(10,1,1,'Agwt8XM8NyKUjsQz/RFGnw==','v7qnCBHqo3d/fsftT4zQ7Q==','2026-03-18 20:58:16',0),(11,6,2,'j6APbhh9dCaMtYGPQObQTA==','qRDFAhq62kinGs+24otfcw==','2026-03-19 08:26:47',0),(12,3,2,'shzojYPBX/3DohJo2sAZ6A==','2AHd3/RJ2KhnplXa4T761A==','2026-03-19 08:27:02',1),(13,3,1,'NanE1I4jwmcE2tZAzp0/9w==','P4XEwqpwRlarg3dSlb3K7Q==','2026-03-19 09:15:59',1),(14,8,1,'Y+yXXRvjO0wrA6NpNSRfJQ==','ZOag+Y7pdBCvS7884t8OVw==','2026-03-19 09:18:19',1),(15,8,10,'+7E7EOKBLLl4i8od6NI4hA==','leXNL8vL7cJatQETBIRbUg==','2026-03-19 09:18:26',1),(16,9,11,'BzPXmcRjXib2kWMNDYq+9A==','x7XYXXEM0HOyKHLXjCZNnQ==','2026-04-13 08:31:03',0),(17,10,2,'MCcNdnkX3FC791pK9bWevg==','C8YS6gRelYutkcRmKMZZXw==','2026-04-13 09:03:51',1),(18,10,11,'nEHmGBQSrUMHcxx7jJb2Fw==','uAgCIvK0X5u27yNixoh3fA==','2026-04-13 09:05:23',0);
/*!40000 ALTER TABLE `chatmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventfavorites`
--

DROP TABLE IF EXISTS `eventfavorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventfavorites` (
  `UserID` int NOT NULL,
  `EventID` int NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`EventID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_event` (`EventID`),
  CONSTRAINT `eventfavorites_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `eventfavorites_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventfavorites`
--

LOCK TABLES `eventfavorites` WRITE;
/*!40000 ALTER TABLE `eventfavorites` DISABLE KEYS */;
INSERT INTO `eventfavorites` VALUES (1,2,'2026-03-16 19:11:16'),(2,2,'2026-03-19 08:29:38');
/*!40000 ALTER TABLE `eventfavorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `EventID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Description` text COLLATE utf8mb4_hungarian_ci,
  `EventDateTime` datetime NOT NULL,
  `Location` point NOT NULL,
  `LocationName` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `ImageFileName` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `Address` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `TicketPrice` decimal(10,2) DEFAULT '0.00',
  `OrganizerID` int NOT NULL,
  `MusicStyle` enum('rock','pop','electronic','hiphop','jazz','latin','metal','house','techno','drumandbass','other') COLLATE utf8mb4_hungarian_ci NOT NULL,
  `MaxAttendees` int DEFAULT NULL,
  `IsPublic` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsFeatured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`EventID`),
  KEY `OrganizerID` (`OrganizerID`),
  SPATIAL KEY `idx_location` (`Location`),
  KEY `idx_datetime` (`EventDateTime`),
  KEY `idx_music` (`MusicStyle`),
  FULLTEXT KEY `ft_search` (`Title`,`Description`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`OrganizerID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Epstein Fest','komoly','2027-10-10 06:00:00',_binary '\0\0\0\0\0\0\0T\0Œg\Ð4PÀ¿ñµg–L2@','Little Saint James','https://res.cloudinary.com/dwgiehe3s/image/upload/v1773656793/events/ggvcv4axuhsthycfzloj.avif','Virgin Islands',0.00,1,'drumandbass',300,1,'2026-02-26 08:35:24',1),(2,'Peaches & Cream','Amercian RNB & HipHop Disco\r\nFellÃ©pÅ‘ : DJ Fenton','2026-05-03 04:00:00',_binary '\0\0\0\0\0\0\0t{Ic´3@M„\rO¯ÀG@','Budapest','https://res.cloudinary.com/dwgiehe3s/image/upload/v1773908328/events/no3rrpo8iluxrbsme5wv.jpg','NagymezÅ‘ u. 46-48, 1065',10000.00,1,'electronic',500,1,'2026-02-26 08:39:06',1),(3,'Teszt','teszt','2027-02-27 08:00:00',_binary '\0\0\0\0\0\0\0ÿ>\ã\Â\É4@>\Ð\nY\rH@','Miskolc',NULL,NULL,0.00,1,'latin',5000,1,'2026-02-26 08:49:49',1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `MatchID` int NOT NULL AUTO_INCREMENT,
  `User1ID` int NOT NULL,
  `User2ID` int NOT NULL,
  `User1Liked` tinyint(1) DEFAULT '1',
  `User2Liked` tinyint(1) DEFAULT NULL,
  `MatchedAt` timestamp NULL DEFAULT NULL,
  `ChatRoomID` char(36) DEFAULT NULL,
  `User1Seen` tinyint(1) NOT NULL DEFAULT '0',
  `User2Seen` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`MatchID`),
  UNIQUE KEY `uq_pair` (`User1ID`,`User2ID`),
  UNIQUE KEY `ChatRoomID` (`ChatRoomID`),
  KEY `User2ID` (`User2ID`),
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`User1ID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`User2ID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (1,1,8,1,1,'2026-03-16 17:05:05','a9c94624-5267-48c0-95d4-f31ab230ff50',1,0),(3,1,2,1,1,'2026-03-19 08:26:58','80a01bcd-96ec-4a70-858f-e9acfb0d1e65',1,1),(4,8,2,0,1,NULL,NULL,0,0),(5,9,1,1,1,'2026-03-17 20:40:21','838c3a66-3220-496c-b6d4-5977a92f666c',0,1),(6,9,2,1,1,'2026-03-17 20:38:32','b83eeaa6-4081-46a6-a6d9-c1ae3a815127',0,1),(7,9,8,1,NULL,NULL,NULL,0,0),(8,10,1,1,1,'2026-03-19 09:18:09','5219a3f7-7e21-4543-9198-33df6248f7ef',0,1),(9,11,1,1,1,'2026-04-13 08:30:43','9409eef8-050e-40cd-b716-a4f2a7e45280',1,1),(10,11,2,1,1,'2026-04-13 09:03:40','d8b006f5-2038-45d2-9609-fa2042dbc1ed',1,1),(11,11,8,0,NULL,NULL,NULL,0,0),(12,2,10,0,NULL,NULL,NULL,0,0);
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordsalts`
--

DROP TABLE IF EXISTS `passwordsalts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwordsalts` (
  `UserID` int NOT NULL,
  `Salt` char(64) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `PasswordHash` char(64) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `passwordsalts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordsalts`
--

LOCK TABLES `passwordsalts` WRITE;
/*!40000 ALTER TABLE `passwordsalts` DISABLE KEYS */;
INSERT INTO `passwordsalts` VALUES (1,'5ec7ac853a0302c8502d837ce6b8d490','74a7cca8dca8c99874e3d61500962014f37fa7d52cb2ee97f9c8eeb038ae7da1','2026-02-26 08:31:28'),(2,'94461d2b5ad842fd94136706976035c1','2230c12ab1451b0ef6a24cb30ac4427b8fce974e2c3a11f81c735ef2b6ed0e85','2026-03-17 20:34:58'),(8,'d471f6e1cfa94610a64a6fa77899e934','0eed5ac5594f411caaaf1aff533752cb386b1b01dd9043880b05e74837793939','2026-03-15 15:23:00'),(9,'a536e57f7a4744a19063d1423e87c31d','e627bbc970ddaa1055f2c70b7067465fcaa5d984b86fdbe1cca186e8b2233569','2026-03-17 20:36:57'),(10,'903d525aac464d378999d886c00367e6','57c4163fa69d342b8771aa69cbe09af95dd39c3b9831b977311e9d6aef956869','2026-03-19 09:17:08'),(11,'4ae799afb0d34acfa7fd189d8107a76e','536b59fe7c9ddd4786c2d5f2beb1070d6cef908fec75a436a1e4a39d695fe374','2026-04-13 08:21:07');
/*!40000 ALTER TABLE `passwordsalts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rankings`
--

DROP TABLE IF EXISTS `rankings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rankings` (
  `UserID` int NOT NULL,
  `RankType` enum('all_time','monthly') COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Period` char(7) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Score` int NOT NULL,
  `RankPos` int DEFAULT NULL,
  PRIMARY KEY (`RankType`,`Period`,`Score`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `rankings_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rankings`
--

LOCK TABLES `rankings` WRITE;
/*!40000 ALTER TABLE `rankings` DISABLE KEYS */;
/*!40000 ALTER TABLE `rankings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `EventID` int NOT NULL,
  `UserID` int NOT NULL,
  `Rating` tinyint NOT NULL,
  `Comment` text COLLATE utf8mb4_unicode_ci,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `uq_one_review_per_user` (`UserID`,`EventID`),
  KEY `EventID` (`EventID`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`Rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userbadges`
--

DROP TABLE IF EXISTS `userbadges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userbadges` (
  `UserID` int NOT NULL,
  `BadgeID` int NOT NULL,
  `AwardedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsPinned` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`UserID`,`BadgeID`),
  KEY `BadgeID` (`BadgeID`),
  CONSTRAINT `userbadges_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `userbadges_ibfk_2` FOREIGN KEY (`BadgeID`) REFERENCES `badges` (`BadgeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userbadges`
--

LOCK TABLES `userbadges` WRITE;
/*!40000 ALTER TABLE `userbadges` DISABLE KEYS */;
INSERT INTO `userbadges` VALUES (1,1,'2026-03-30 20:49:21',1),(1,4,'2026-03-30 20:49:21',1),(11,1,'2026-04-13 08:41:24',0);
/*!40000 ALTER TABLE `userbadges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Role` enum('user','organizer','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `DisplayName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Bio` text COLLATE utf8mb4_unicode_ci,
  `ProfilePicture` longblob,
  `ProfilePictureMime` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Points` int NOT NULL DEFAULT '0',
  `Gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `LookingFor` enum('friends','party_buddies','both') COLLATE utf8mb4_unicode_ci DEFAULT 'both',
  `IsActive` tinyint(1) DEFAULT '1',
  `IsVerified` tinyint(1) DEFAULT '0',
  `LastActive` timestamp NULL DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_username` (`Username`),
  KEY `idx_email` (`Email`),
  KEY `idx_points` (`Points`),
  KEY `idx_lastactive` (`LastActive`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@admin.com','admin','Jeff','',_binary 'ÿ\Øÿ\à\0JFIF\0\0\0\0\0\0ÿ\Û\0„\0	( \Z%!1!%)+...383-7(-.+\n\n\n\r\Z-%---------------+----------------------------------ÿÀ\0\0\Â\"\0ÿ\Ä\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿ\Ä\0>\0\0\0\0\0!1AQaq\"‘¡±2Á\ÑðBRb’\áñ#3Sr‚C¢²\Âÿ\Ä\0\0\0\0\0\0\0\0\0\0\0\0\0\0ÿ\Ä\0#\0\0\0\0\0\0\0\0\0!12A\"#Qÿ\Ú\0\0\0?\0µ8Q	\Ö©É–ö	\ÊAD\'XRH(©³$¤Ð¦\Z9¡hèš´2\ÝÜŠºÙ\æ@ˆR\éôþ©<‡\Ä;\ì\à\Ò{$\Ëgq\Â\"ú÷‡—\â¡HN>ñ\èz­\ä>,\æÐ1*—°„QôHò\n/¡\á“äŒ¡`cTÃ’-2™\ì!H\ê°\ä\á\Ëi&”–§”\É€ò’iN³9ùN™$Y ’ˆ)\Ñd“‚¢u\î5\É\ä…i:¨\n\ÊuÀ\ëN\èl˜’LCF€õ3Ã¡Vl\Êo/.\'\Â\Ü\Í\ÄjzcJ\ÉOKq¿ wò‘úWÙ›€\\I<A>z…\ËT¹ªj¹Ž\Ó\Äùcžx\ã¢/axF\0ð-w9¤¶©14\Ø\È\rly	ó…Ž¥\ÍM\â‡‘ÁÂ½—M~‹ñBT«´4\ê8Cc0QNõ\ÍË«8€Ö´yœŸu¾\Ûk$;¦ñqYE\nuo€O\ïc\ÉPÝ–\êfd	2#@	g:B0<Eóˆ\ã\Ë*‹¬H\0b5\êJuI\Ä\Ç\Ó1ƒ\æ\Óuº7@‚OÊ’…\Â\è~†\Ðiv\ìÁ\æ§VIW6\ÛÁó7Cwf“À\Ý¡y\Ë9‚4„S±°\'•G9\ï2œ”\ÄL ªJPÓªƒ”¥fNRP\ÞL³‚’Œ§•…$”R%fI¯\0\åº°yyvøku\ÞvwG 8¸™TÕ¿ñ\ÖŸ\Ü\È\r\áòFz\ËJL”\Â+µ®\ÃP†L¸e\Ît“\0\Ä7A\Ã\ÞÄ«\Ì|N“\ÊGCõ\\öÉ·:\Â4\ËW:(\Üô\í\Ã\ã\Û;¯E¤\ÉA#\éT,š#B H>\Þ\å[J\Ù\Î2\ãˆ\Ðq\î¶Ð·%\ÏkaÁ¦6Z\"c¾°­§I\âD… œS	7Vþ<Bª\Ú8\è´Ñ¹ªÁŸ²\Þ\Ê}9±ªmÐ¼xÙ¦2r†\ÝX\Ïtn Â¡\ì„þV¥x¤rU-w_.\ÌLOxvZ\í\é\ncqßµ¤q\é\ÑÀ¢·6Á\âÚ”~Y\0‚DŽˆU\Ç=\Ç//\ì¦\"2³\ßEy2¤ûÛ‡7ý®m?š™pŒUgU)JN)¥m\ÓÊŠK1÷’QIa”“$ƒ%)ª>AUt%»£S€³\ß30\à\à\à~£\ÒVª\Åvƒ\Äs\ç3#Ô­Y†±»¸ðŽü•\"†\ã@R\ä½:x0\Ýµ§°C\èBØ“¢\å\ÓÔ“¦úkH•TX´Ãµ¬\0ôP¶kd™q\êæ´0-\r\Ê²†‘¡ôY\ëÀð¹Qr1‚«Dcû,µ\n\ßpV1Pð«­NDú+\ËaW_NIñŽ|\â»\Z®Þ‡öÁL\é?\Ñ}(\Ô \í..n\ìj&yH\ç\Þn5ûÃ¡ÐŽË§·\É5C\êD\ã\n©ZnY\å+¦M9O*¹R•˜ò’Œ¤†„\"S¨¥(1\Õ\Ö\Ôwœ:gðT\"<~HQŒ[v‰sšF=„zj±\Ðlat—´\'+›.ñù¨r;~;u»x¢Tjˆ\ÂÁB—¾\ØB‡nýˆQqZ¼VZ5\0Z\è\Õ\Óþ\n\êmr™žiS¨„¬œ»šg\ïsRŠ‹\Ý\ÑÌ•	\î³\Ì\ë+UR«\"S\ÈZ\Ì\à¡Q’ˆ…„ñ\Ëf\ÛO0\Ó¯U¦Á°\Øv!\ÅWa‡z¢u\èh@\ÔýAV\Ç\Ó\Ï\äöwG$‰\Ôp\ê†<A…\ÐUlƒ<KñO\"*R%A%™9IE$’d\à%\Ø\"[!§\Ä{G¢‹Y@`\êJ#/_\áó÷\\µFŸ›=pº\çøakFòŽn¯\ìJ\ÜL-ŒbÛ¦·U\ífŽ+š\Çvô,\È\Ú/¹\'mð3\ìˆZ\ív»º2“¬£P\0³\ÙVœõ>\Æ+;½\á®Øˆ`<\äú’SÁ®<\Õ«”\"\âøª\Í[lµ£Y\îšBÜ†\ÜùH\Â\äñ $fIÆ°>‹]-¶\Éû\ÐN™\ÔòDžn\íU8*-ï‰ N‹UB8*c	\Ü+G\r\ì\ã+¡·p\Ý\'2¹¶µ\Ù\Õ\'¹öÂ¾1\Ã\Ë5T\Üý\çf}W?µY•\Ó\Þ#™<#€@6û\0-#—ªde8PN\n”¤¢’™$’1\Ñgø[ÿ\0/hü\Ð\ÙZmŸ\"9¨Æ¢\è\Ú7¿,k”{iº\\—ñ\'9\â&#\ÉN\Í\×O²m@\Úy\Ð\ç™+G\Øk8HÀ÷Vl\ëX‰G*m;[vÿ\0PO\î3\Ä\ï@“þ:f;›®{\ì•G\ÞöHTs\n\Ññˆ§N8K\ç>…¸\Úq‰o`O¡)´\ÞRz¯GøV®õ™1\å9“\êŒØ°±¡³0\â>¹x/cð–ö:û¯A£I§&}HP\Ër¯Œ\Ü\Ø\ÄvgZ@\Ä8p<p¹ºLI?@»Œš\ãD\îp\Ï}W˜×«Q¸s‹	\à7g¦U´•½\é\ÐQØ®©Ák£°\ßLñ\Ðz.n\Ûâ»Š\Þ\è?„û®‚\Ï\ã°ñþ3\Z\Øý¬\Æ{J:¿¤\Þ\Õ¤^Ü—p\à¶\ì\í­&$D\ÄðYmöÕ½Hñ6`\àDò\'DE›u\0AOŒ\Ñn\Æ\Z\é>ˆ®È­Œ\ê¨5ÀZ6UX¨Ztv[þ\î-üS\ã{C—Á«Æ\é\Ò½úõ@¶\ä´ó,h^;Aü0ô@6\Ý\\ñ\×\È*¹Š@¨‚¤\nV<¤›	%0zP’IX\ÎVZ;Ä¨yUŠ¥¦F¨´\Ú Lú —ð˜\Â#{_y\Ó8\0\å©U[ŒK›\Ç\r\Ôù®~K§\ÇÇ qe^¿\Ýw\Éf›\Ñ\â=„,®ø)ÀÃ·Ÿ9\Þi\Ìõ+¨©i[ï°\ã‚\Ã÷c‘\ç\ÝWN¥\Ó\ìøT1=da\'Ž¿\á™XüLx·*L\Ì\Ô~;\î·ñ[Û°(oýÖ¹\Ã3Óš\Ñökº\ÐñI¼C%\ÇùŒG¢\ßöfÑ§ºÉ’|N&\\\î\å³\Êþ´\á\ÃL–Í§PB\ëmò\Õ\Ï\Ú2^	]]¸š!ú¶=@«š{\Ø9B¯6K1,‘\ÏõG\êSÊ“iª_He;rƒ\áúOÉ£F¯W±®#¿1\æµZü=I¸é³¥6û\"7\Û1\Î;ôži»\Ô\"²Ó§z1ó)ô\ÌùC€ZeZqc\ím_‡-\Þ!Ôš\á\Û>eB\Ö\Ës\Â\É,\Üs\ÜHó\â´Ò·¨\ïó*8ó\Z\Ó\Ò5¬3 rGe¸£N8(³üÀ¤\àõ\n\×7\ÕUTÁk†¡\íÿ\0\ØJ¦5Íœ\ê‹\í€Ày‘?¯5\È\n\Î{Cœw‰.Îš8<‘m©Zjj`þ^\ÈmZ[­Á\î¾!õT¹m9\çø­T\n’ˆR	\Ð)I:HƒŠ‘*·¬ƒŠ¤»*o+;\Öe•jKú\îŽÑ”J\Ç@N¨Aª$Od^À{.^OoG‚\ëj!hkeg¢V\ÊnRýu\ãH±\Úw\0CF\\x-»FûtcUŠ›L¾7ˆ“\Æ9g}	l†’ì®¾Î˜\Ý#ŒO’\ã¬\ïWAg´€\â˜w\ÒÊ¡-þIþs]• \æsU\Õ\Òv\ËP¥PTª\ÒCn‰a\ßžÇŠ!o\\8)\ëTe\Ü0\Âp\Õ7…\\§\Æ<ºF¶¡¹ u_ì­ªp²<uU92¨\Ü<‡4ˆ,s‹s\Ì}\n«h´Í¤z\Í-¯P\î\ÒýM\ã\Ûq\Ã\êTv®NxŸ£e,û›)®-±‚¤l*at<\èt’I)ƒ\ÜUn*N*§”SÊ¥\åZò¨yF1Œc²#oRu†Ý ù+ .\\\çoO)qš·¯…\'\Ü\Ç2Þ²Ë´/H†·.q\Ýh\æO\á\Ç\ÉO[tÁGšµgP\ÏwAõTüBó2\Óv:z-\Ö>S\0\Ô\êO^*£G}\Õk–\îÜµ½õ@\Äm\×\Ñ¥´4 \Ìé•ž½’\Èûn*\É¹\×Oÿ\0Wý†}\èË†C2³Y\ØTù¦§Í¨\é\à÷\è4AGb\ìÙ…\ÔÑ =w5¢L¬«™Gy›§ˆP„\ì\Ê\åŽs«L¼˜FšP»Gv+·V\á\à¼\Ï\Ìkê¥”ÿ\0J\ã`\Í7Êƒ\ÂÅ³\ï€Œ\Ê\ÜôqôžuEU˜Œ­5+;\ÌÔ\îŸntÿ\0c=\Ï9ýž8!{R\à8µ£FƒždñôŸT_j¹­¤\âãŽœzú.\\\Õ\Þ3Ï‡.ˆ\ã{nK0ñk¦¬\nŠe\\\n³Œ\é$’S¸ªž¦\å[/TT\n÷*³,\Ù\ã\Ä{~)\Üì•„\Õ ˜ÄˆM³Ž¢u3•L/·g\Ç\äšña°ì—·\æ:«õ±³û#C\æHEv[7°±\ßl‡4¼7w\á$I®j1\×n ¡¾i\ÂqWyr\î}Jx-.\ÆcòI¿n\è\Ó\'÷º\æ[‚»=¥\Úb!r5v\Ë\Ürø\ì·[íŠ›»¿0O\ÅjŸÃ¸\ì\íi\à- \Æv\éc¼U\0=Hh…‰\0»u\ã÷š@ö”ódÏ†ûŽ°TKœÈ®iŸ[.pIœO.\ê\ë}¦\Ú\Äü£¼¢L¢›öz\î \'s\ï\Ó\è\Ç\áøN;B\ê\Z\ï\n\ç«Z¹Õ©¼ðc›\Ô\ÉiýwGX0Oc•\Þ2˜!~\é\Ô\Ú\Ç7_˜\ßA$otasŸTû\æIô\Õ<\ÇwH\\¼g’[gjŠ\Íc[À‡\à¼ù,4V:Ke «1\ÔÓ—<¼®\Úé• ,\ÔÖ†¬T¥2IÐ†•SÕ…Vô¬¥\ÅPõ{–zˆí™ªªm\ß\nÚ«,\å\ëCÕ•\Ñ\Ù]n8¡ö+¡m@öG5\É[;xB!krF9.\Õz›\Üj«@oA\nªT˜‰ ÷V\×|ÁY®¼1ª\ÛSC- F\0•ÿ\0`µ\'y\Ìi#ŒzÄ®V…G0­tk9\ÜQ–š\æ\ê[cm¨ÜhÀŽ©Í­ô\Ùü£½g\"V\îteW^J\ßöFL\î6\ÚÔªY°¸;t1#‘Bj5±•g\ÎL\ÉUz@9½ˆ÷\nÐ¡Q\Þ-­+N’·­!]À.CoUÞª&ýIü‚\è¯\ëð\æ¹·\ÍG±\èpsó}R¤µ\Ó+%5ªšw;]5sVzjö \É\ÊJ2a\r*§+UO)S•\n¹\åa¼ºm1/p®\ÖuN²³.j\íƒS\Â\Ù\r\ë©î©¥µ\Ü\Úa€dbJvÛ²´¯ºA\á\Å¬\Ì1\Ì.[eV5)5\ÇR8w#ð]Ë¸ZxaqòNÞ§xÁãš­ô\Ü\ÒF‘„¶y‚G#\ìŠÔ¦?ANªú}!\ä…\Ò}‰†~\n\Ö\ìši‚y¸¸ú\æc\í´iTñµ!n§a@ùlô¢°X°Ž’HòO¾Ë–,§‚\ßoK@N\Ê0Uú\'KLÕ›»¦ŸE^ô	V\×p+õln„Ð¬\\\â\ãú™{\å\Äó$®ƒlWù6õjqm7\Þ {¼z\ËiU¦e¯=–ž\áS7=üz;\n\ÕL {j¶°\ä\á«\Ì#4Š£Ÿm\Ô\Õ\ìYi­\r(2\ÈIE:°·*žUŽU¹!€6®\ßcSñ»ÿ\0ù®J\î\éõ¼ó\'õ G>&\ÙÁŽù\ä\îw\\óÚ©$OjÊŠ“•¶´7³\Éj3·K°jE&ŽŸýb‹\È2-›€\0\àŒ\Ó+“9ºõ¸¾°fa¼0ºJ\Â;®-\Ï-\ìŒ\ì«\ÐD¥aÎ…s.tB\ÍYP§Xp€\Ê\èCÁZP b\è*ú7Q×†U!m/T\ÜU\0,\Æ\á¼\Ö›¢p4T\Æ%i\ê]dÂƒª\Ø\Õv>ƒ1ÿ\0èµœ-\Ö\çy\ÌÞŽ\rIöÊ—²\íP-9‘\åy\æ\Üør_Hc÷$frt—7W¸\ri\\±Á\Í0ABô\r…´…vNŽn\ÞG˜\èW1Ù—n¤ðö\ê58‚¬\âze2´1\ÙwÌ¬\Ð\æ\à\àƒÈ„M…Y)&”0cŠ©\î„\Zÿ\0\â&7ñg\rþ«œ¾Úµ*}\ç\ä	\Ñ.¨n7üCµšñòÙ‘\"]Û’\çR¬\åA)\áRx[¶`ð»¸ú,M3…¯g`¸v>Ÿ\Ý½Žÿ\0a7\æ«gJ\çš`\Ê+c_1\è¹òŸ¯C‡/Á‘œIaU\í\ÈU\ÔÂœtX\ÑGj‘ª“ö‰(~\ä”J“@\Z\'˜J\Ù\Ù|FŠñµN’VO–£¸\Ñ?Œ\ëB\ç\ä\È\ëk\Ú\0XljÀWŠ²SN‰f\êúmSy\à®\nŠ®Á(Zi\îªxŠ¬Û‡·E•®\ÑsrU±<«i\ÐÜ­Q±£æšš\Õñº¬F›\ä.?™‹»Q\ãr\ë\Î\ècbm’ý\çN\é\è\áÈ®\Ú\ÆþQ,xwcŸ0¼\Ø	™P°\È$r }BzHõM\î©×ž\r½_ýgz0þ	%Ñ¶L\åV\ã•oAœ«*\Å\Zµ\ÛWƒ•˜µ8ZŽÿ\0F^4:Ê½’\0#†¢lòtR©p\ã‰\Ç%+…\ÚøóI6\ëm.$J\Ôr5³ª¸\rpQ¸•±\Õz<|“<v·\ä¢\ÓBxª\Øðt*ÁTŽHÁ± 5LPœª©\×Z]P<SŒ-–¹C\Ú7Š-kN[G\ÆEÁg¼¨wcš½\Åd®\â\\;¡²\é\Ì\æ®ZI8\0“\Ð’¤ö\É!s\Z\ß\î0PiñT\Ëù†\r\å\'\Ø(k\Ë=Y\Ì0¶¸÷\Ô.qq\Õ\Î.þc*tÂƒBº0½#\Å\Ê\ì\Å<H\ê¢Jv•«EP’\Ñ!2\Úm3½T’IX¡>\êI,5…u&	I$KZYD\Zu&X@d\Æq+3BI%žDöN‡¡F\è’Q\äû=‹ …+v»Q\èHL\êqÄ¤’Ö“\ZŸx¤’j\ØÍ…!‰I%(5J\Ã\ÄIbþ yvÒ®\ê•j=\æ\\^\á\ä\Ü\0:@N’?\í\\¿3\ë°+^0’K¾zy\ÕPR)’H\Ð\É$’ÿ\Ù','image/jpeg',185,'male','2000-01-01','both',1,1,NULL,'2026-02-26 08:31:27','2026-04-02 04:51:46'),(2,'gpt81221','gpt81221@gmail.com','admin','Jack',NULL,NULL,NULL,0,'male','1999-01-14','both',1,1,NULL,'2026-03-15 14:12:16','2026-04-16 07:16:35'),(8,'epst','teszt@email.com','user','epst','',NULL,NULL,0,'prefer_not_to_say','2008-02-22','both',1,1,NULL,'2026-03-15 15:22:59','2026-03-15 15:24:03'),(9,'test911','test@test.hu','user','Test','',NULL,NULL,0,'male','2010-03-12','friends',1,1,NULL,'2026-03-17 20:36:57','2026-03-17 20:39:39'),(10,'BordasDaniel','bordas.daniel0124@gmail.com','user','BordasDaniel',NULL,NULL,NULL,0,'male','2006-01-24','both',1,1,NULL,'2026-03-19 09:17:08','2026-03-19 09:17:30'),(11,'Roland77','sandorr@kkszki.hu','admin','Roland77',NULL,NULL,NULL,0,'male','2006-02-10','both',1,1,NULL,'2026-04-13 08:21:06','2026-04-13 08:55:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'partypulse'
--

--
-- Dumping routines for database 'partypulse'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-16 10:36:29
