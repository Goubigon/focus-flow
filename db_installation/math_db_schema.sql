DROP DATABASE IF EXISTS `math_db`;
CREATE DATABASE `math_db`;
USE my_database;



-- math_db.math_session_parameters definition

CREATE TABLE `math_session_parameters` (
  `mParametersIdentifier` int NOT NULL AUTO_INCREMENT,
  `mMinNumber` int DEFAULT '0',
  `mMaxNumber` int DEFAULT '10',
  `mFloatNumber` int DEFAULT '0',
  `mNumber` int DEFAULT '2',
  `mAdditionCheck` tinyint(1) DEFAULT '1',
  `mSubtractionCheck` tinyint(1) DEFAULT '1',
  `mMultiplicationCheck` tinyint(1) DEFAULT '1',
  `mMaxAnswerCount` int DEFAULT '0',
  PRIMARY KEY (`mParametersIdentifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- math_db.math_user_credential definition

CREATE TABLE `math_user_credential` (
  `mUserIdentifier` int NOT NULL AUTO_INCREMENT,
  `mUsername` varchar(255) NOT NULL,
  `mEmail` varchar(255) NOT NULL,
  `mHashedPassword` varchar(255) NOT NULL,
  `mRole` enum('admin','user') NOT NULL DEFAULT 'user',
  `mCreationDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mUserIdentifier`),
  UNIQUE KEY `mEmail` (`mEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- math_db.math_session definition

CREATE TABLE `math_session` (
  `mSessionIdentifier` int NOT NULL AUTO_INCREMENT,
  `mUserIdentifier` int NOT NULL,
  `mParametersIdentifier` int NOT NULL,
  `mSessionDuration` float DEFAULT NULL,
  `mSessionDate` datetime DEFAULT NULL,
  PRIMARY KEY (`mSessionIdentifier`),
  KEY `mUserIdentifier` (`mUserIdentifier`),
  KEY `mParametersIdentifier` (`mParametersIdentifier`),
  CONSTRAINT `math_session_ibfk_1` FOREIGN KEY (`mUserIdentifier`) REFERENCES `math_user_credential` (`mUserIdentifier`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `math_session_ibfk_2` FOREIGN KEY (`mParametersIdentifier`) REFERENCES `math_session_parameters` (`mParametersIdentifier`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- math_db.math_user_stat definition

CREATE TABLE `math_user_stat` (
  `mUserIdentifier` int NOT NULL,
  `mLogNumber` int DEFAULT '0',
  `mSessionCount` int DEFAULT '0',
  `mLastSessionDate` datetime DEFAULT NULL,
  `mTotalSessionTime` float DEFAULT '0',
  PRIMARY KEY (`mUserIdentifier`),
  CONSTRAINT `math_user_stat_ibfk_1` FOREIGN KEY (`mUserIdentifier`) REFERENCES `math_user_credential` (`mUserIdentifier`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- math_db.math_answer definition

CREATE TABLE `math_answer` (
  `mAnswerIdentifier` int NOT NULL AUTO_INCREMENT,
  `mSessionIdentifier` int DEFAULT NULL,
  `leftOperation` int NOT NULL,
  `mathOperation` char(1) NOT NULL,
  `rightOperation` int NOT NULL,
  `qResult` float NOT NULL,
  `qAnswer` float NOT NULL,
  `isCorrect` tinyint(1) NOT NULL,
  `qTime` float(5,2) NOT NULL,
  `qDate` datetime NOT NULL,
  PRIMARY KEY (`mAnswerIdentifier`),
  KEY `mSessionIdentifier` (`mSessionIdentifier`),
  CONSTRAINT `math_answer_ibfk_1` FOREIGN KEY (`mSessionIdentifier`) REFERENCES `math_session` (`mSessionIdentifier`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;