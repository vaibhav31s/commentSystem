-- Schema for the commentSystem backend (reconstructed from the Slim routes).
-- Loaded automatically by MariaDB on first start (docker-entrypoint-initdb.d).
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `Users` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `avatar` TEXT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uq_users_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Blog` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(500) NOT NULL,
  `Description` MEDIUMTEXT NOT NULL,
  `authorId` INT UNSIGNED NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tags` TEXT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_blog_author` (`authorId`),
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`authorId`) REFERENCES `Users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Comment` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blogId` INT UNSIGNED NOT NULL,
  `authorId` INT UNSIGNED NULL,
  `authorName` VARCHAR(255) NULL,
  `comment` TEXT NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `idx_comment_blog` (`blogId`),
  CONSTRAINT `fk_comment_blog` FOREIGN KEY (`blogId`) REFERENCES `Blog` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Threaded replies: replyId points at the parent reply (NULL = top level).
CREATE TABLE IF NOT EXISTS `Replies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blogId` INT UNSIGNED NOT NULL,
  `replyId` INT UNSIGNED NULL,
  `authorId` INT UNSIGNED NULL,
  `authorName` VARCHAR(255) NULL,
  `reply` TEXT NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_replies_blog` (`blogId`),
  KEY `idx_replies_parent` (`replyId`),
  KEY `idx_replies_lookup` (`blogId`, `timestamp`, `authorId`),
  CONSTRAINT `fk_replies_blog` FOREIGN KEY (`blogId`) REFERENCES `Blog` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Vote` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `replyId` INT UNSIGNED NOT NULL,
  `authorId` INT UNSIGNED NOT NULL,
  `blogId` INT UNSIGNED NOT NULL,
  `voteType` ENUM('up', 'down') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vote_reply_author` (`replyId`, `authorId`),
  KEY `idx_vote_blog` (`blogId`),
  CONSTRAINT `fk_vote_reply` FOREIGN KEY (`replyId`) REFERENCES `Replies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
