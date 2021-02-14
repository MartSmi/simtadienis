CREATE DATABASE /*!32312 IF NOT EXISTS*/ `bankas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `bankas`;

--
-- Table structure for table `sessions`
--
DROP TABLE IF EXISTS `blackjack`;
DROP TABLE IF EXISTS `play_history`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `users`;


--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `klase` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` int(11) NOT NULL,
  `can_send` tinyint(1) NOT NULL,
  `can_receive` tinyint(1) NOT NULL,
  `is_station` tinyint(1) NOT NULL,
  `is_frozen` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `full_name` (`full_name`)
) ENGINE=InnoDB AUTO_INCREMENT=419 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_from` int(11) NOT NULL,
  `id_to` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `time` time NOT NULL,
  `reverted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id_from` (`id_from`),
  KEY `id_to` (`id_to`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`id_from`) REFERENCES `users` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`id_to`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `play_history`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `play_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` tinyint(1) NOT NULL,
  `bet` int DEFAULT NULL,
  `winnings` int DEFAULT NULL,
  `ended` tinyint(1) NOT NULL DEFAULT '0',
  `time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `play_history_uid_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=831 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackjack` (
  `user_id` int NOT NULL,
  `game_session_id` int NOT NULL,
  `player_points` tinyint NOT NULL,
  `player_aces` tinyint NOT NULL,
  `dealer_points` tinyint NOT NULL,
  `dealer_aces` tinyint NOT NULL,
  `time` time NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `game_session_id` (`game_session_id`),
  CONSTRAINT `game_session_id` FOREIGN KEY (`game_session_id`) REFERENCES `play_history` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
