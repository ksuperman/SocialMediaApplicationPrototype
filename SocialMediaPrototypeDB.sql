-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 05, 2015 at 01:38 AM
-- Server version: 5.5.44-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `SocialMediaPrototypeDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `FRIENDS_LIST`
--

CREATE TABLE IF NOT EXISTS `FRIENDS_LIST` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER1` bigint(20) NOT NULL,
  `USER2` bigint(20) NOT NULL,
  `ACCEPTED` varchar(10) COLLATE ascii_bin NOT NULL DEFAULT 'N',
  PRIMARY KEY (`ROW_ID`),
  KEY `USER1` (`USER1`,`USER2`),
  KEY `USER2` (`USER2`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=41 ;

--
-- Dumping data for table `FRIENDS_LIST`
--

INSERT INTO `FRIENDS_LIST` (`ROW_ID`, `USER1`, `USER2`, `ACCEPTED`) VALUES
(1, 63, 64, 'Y'),
(2, 63, 65, 'N'),
(3, 63, 66, 'N'),
(4, 63, 68, 'N'),
(6, 63, 67, 'N'),
(9, 69, 64, 'N'),
(34, 63, 69, 'Y'),
(35, 69, 63, 'Y'),
(36, 70, 64, 'N'),
(37, 70, 63, 'Y'),
(38, 63, 70, 'Y'),
(39, 73, 63, 'N'),
(40, 73, 64, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `GROUPS`
--

CREATE TABLE IF NOT EXISTS `GROUPS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `GROUP_NAME` varchar(100) COLLATE ascii_bin NOT NULL,
  `GROUP_INFO` varchar(500) COLLATE ascii_bin NOT NULL,
  `IMAGE_URL` varchar(500) COLLATE ascii_bin NOT NULL,
  `CREATED_BY` bigint(20) NOT NULL,
  PRIMARY KEY (`ROW_ID`),
  KEY `CREATED_BY` (`CREATED_BY`),
  KEY `CREATED_BY_2` (`CREATED_BY`),
  KEY `CREATED_BY_3` (`CREATED_BY`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=7 ;

--
-- Dumping data for table `GROUPS`
--

INSERT INTO `GROUPS` (`ROW_ID`, `GROUP_NAME`, `GROUP_INFO`, `IMAGE_URL`, `CREATED_BY`) VALUES
(5, 'Car Freaks !!', 'This Group is for Car owner in the Bay Area.', '/images/group_thumbnail.jpg', 63),
(6, 'Aftermarket Car mods', 'This group is for the discussion of Aftermarket car modification in the Bay area', '/images/group_thumbnail.jpg', 63);

--
-- Triggers `GROUPS`
--
DROP TRIGGER IF EXISTS `Add Creating User to New Group`;
DELIMITER //
CREATE TRIGGER `Add Creating User to New Group` AFTER INSERT ON `GROUPS`
 FOR EACH ROW BEGIN
INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES (NEW.ROW_ID,NEW.CREATED_BY);
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `GROUP_USERS`
--

CREATE TABLE IF NOT EXISTS `GROUP_USERS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `GROUP_ID` bigint(100) NOT NULL,
  `USER_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`ROW_ID`),
  KEY `GROUP_ID` (`GROUP_ID`,`USER_ID`),
  KEY `GROUP_ID_2` (`GROUP_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=13 ;

--
-- Dumping data for table `GROUP_USERS`
--

INSERT INTO `GROUP_USERS` (`ROW_ID`, `GROUP_ID`, `USER_ID`) VALUES
(12, 6, 63);

-- --------------------------------------------------------

--
-- Table structure for table `LIFE_EVENTS`
--

CREATE TABLE IF NOT EXISTS `LIFE_EVENTS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `EVENT_NAME` varchar(500) COLLATE ascii_bin NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ROW_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=24 ;

--
-- Dumping data for table `LIFE_EVENTS`
--

INSERT INTO `LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES
(1, 63, 'You are Born', '1988-08-13 07:00:00'),
(2, 63, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(3, 63, 'Walked Your First Step', '1991-08-13 07:00:00'),
(4, 63, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(5, 63, 'Started Primary School', '1994-08-13 07:00:00'),
(6, 63, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(7, 63, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(8, 63, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(9, 63, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(10, 63, 'Bought a New Car', '2006-10-13 07:00:00'),
(11, 63, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(12, 63, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(13, 73, 'You are Born', '1988-08-13 07:00:00'),
(14, 73, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(15, 73, 'Walked Your First Step', '1991-08-13 07:00:00'),
(16, 73, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(17, 73, 'Started Primary School', '1994-08-13 07:00:00'),
(18, 73, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(19, 73, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(20, 73, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(21, 73, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(22, 73, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(23, 73, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `NEWSFEEDS`
--

CREATE TABLE IF NOT EXISTS `NEWSFEEDS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL COMMENT 'Forign key to Users Table',
  `POST_MESSAGE` varchar(1000) COLLATE ascii_bin DEFAULT NULL,
  `IMAGE_URL` varchar(500) COLLATE ascii_bin NOT NULL COMMENT 'Rakshith Koravadi Hatwar',
  `TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ROW_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=25 ;

--
-- Dumping data for table `NEWSFEEDS`
--

INSERT INTO `NEWSFEEDS` (`ROW_ID`, `USER_ID`, `POST_MESSAGE`, `IMAGE_URL`, `TIMESTAMP`) VALUES
(1, 63, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(2, 64, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(3, 63, 'Test Message post 2', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(4, 63, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(5, 63, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(6, 63, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(7, 63, 'Test Message post 1', 'http://www.gettyimages.co.uk/gi-resources/images/Homepage/Category-Creative/UK/UK_Creative_462809583.jpg', '2015-10-02 21:45:37'),
(8, 63, 'Posting New Message !!!', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-02 23:47:52'),
(9, 63, 'Testing First Message', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-02 23:55:44'),
(10, 63, 'Testing Second Message', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-02 23:55:55'),
(11, 63, 'Testing third Message', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-02 23:56:12'),
(12, 66, 'Posting my First Update', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 00:47:35'),
(13, 66, 'Kevin''s going to post something now !!!', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 01:00:39'),
(14, 66, 'Testing if everthing is a A OK !!! ;)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 01:06:35'),
(15, 63, 'Posted New Message :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 07:47:11'),
(16, 63, 'Again Posting a New Message :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 07:50:44'),
(17, 63, 'New Post to Test if Everthing is working fine ??!! it seems to be so :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 07:58:41'),
(18, 63, 'new post', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 08:51:09'),
(19, 69, 'Bob Marly Thinks he is very cool :) :P', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 09:44:43'),
(20, 63, 'Rakshith has put in a new post !!!', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-03 10:21:49'),
(21, 63, 'writing a new Post', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-04 02:31:59'),
(22, 70, 'This is James''s Post !!!!!', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-04 06:07:01'),
(23, 73, 'First Post by Eric :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-04 09:02:47'),
(24, 63, 'This is my Latest Post !! :) All is well :D', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-04 22:21:53');

-- --------------------------------------------------------

--
-- Table structure for table `USERS`
--

CREATE TABLE IF NOT EXISTS `USERS` (
  `ROW_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `FIRST_NAME` varchar(50) COLLATE ascii_bin NOT NULL,
  `LAST_NAME` varchar(50) COLLATE ascii_bin NOT NULL,
  `EMAIL_ADDR` varchar(80) COLLATE ascii_bin NOT NULL,
  `DATE_OF_BIRTH` date NOT NULL,
  `PASSWORD` char(60) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `GENDER` varchar(10) COLLATE ascii_bin NOT NULL,
  `IMAGE_URL` varchar(500) COLLATE ascii_bin DEFAULT NULL,
  PRIMARY KEY (`ROW_ID`),
  UNIQUE KEY `EMAIL_ADDR` (`EMAIL_ADDR`),
  KEY `EMAIL_ADDR_2` (`EMAIL_ADDR`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=74 ;

--
-- Dumping data for table `USERS`
--

INSERT INTO `USERS` (`ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`, `PASSWORD`, `GENDER`, `IMAGE_URL`) VALUES
(63, 'Rakshith', 'Hatwar', 'rakshithk@live.com', '1333-12-13', '$2a$10$CbSe14VfcKWaZItB2tuT7ukkwWMt7a7flT.LzIi.W4mSZfqt0dGS6', 'male', '/public/uploads/976867.jpg'),
(64, 'Rakshith', 'Hatwar', 'ksuperman@gmail.com', '1988-08-13', '$2a$10$YynR3HXt.HQ8alPKEpGjue6kzD9Wx/cnn3uP4XwzsWO2fcryNUUdK', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(65, 'Kevin', 'Scott', 'kevinscott@gmail.com', '2005-08-13', '$2a$10$R3Vx.fXPUHR9nmxTLqR.AOhcTLalG9lMCjqM1huuoYHtwpDemp/nq', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(66, 'Rob', 'Thomas', 'robthomas@gmail.com', '1990-09-18', '$2a$10$zfev7l7EhRdGTmROr6K1rOgjMdUJSgO9IdYMK1iNANUK3IrbUfKSW', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(67, 'David', 'Blain', 'Davidblain@friendscircle.com', '2011-02-08', '$2a$10$nc.X8FTyOGm2VqRXF5LZteOjSD62qVPIp3LyHVZODYoKz.72uORWy', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(68, 'Mike', 'Myers', 'mike@gmail.com', '1988-12-13', '$2a$10$YARbaX6ijraEKiuU/9F9lOQzbcKdxzBBAmGYWjCLTqsX5BEz5oVxq', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(69, 'Bob ', 'Marley', 'bobm@gmail.com', '1967-12-13', '$2a$10$yd2btDzGcQeNEP32JLQv.u0/mZLTPbZ3BFD4cOoh/oEnzE1vwVivS', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(70, 'James', 'Camaroon', 'jamesc@gmail.com', '2001-12-13', '$2a$10$6VkHdUs54B5e/NVj3G96FeqdeE/xRXj1TtpHdpeaxK3H7/Zrx0pT.', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(71, 'James', 'Bond', 'jamesb@gmail.com', '1985-09-18', '$2a$10$HXrZVMhOmh/CMz4d7j05lOygfZ2TthWnGbrrI8WTXhMu5W27dzK9W', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(72, 'Peter', 'Parker', 'spidey@gmail.com', '1982-09-18', '$2a$10$O85QW6QxLNIZCNnqx9F/Ke1U4nmcdbZwNceO.lb72tn1NM8848NmC', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg'),
(73, 'Eric', 'Lencher', 'eric@gmail.com', '1920-09-15', '$2a$10$GdSQy.8k5e5G5JwXssUaDezUJc2PdWZrVK3loB.urIaPrcbAM9XTu', 'male', 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg');

--
-- Triggers `USERS`
--
DROP TRIGGER IF EXISTS `DATA_POP_TRIGGER`;
DELIMITER //
CREATE TRIGGER `DATA_POP_TRIGGER` AFTER INSERT ON `USERS`
 FOR EACH ROW BEGIN
 INSERT INTO `SocialMediaPrototypeDB`.`USER_DETAILS` (`ROW_ID`, `USER_ID`, `HOME_ADDR`, `WEB_URL`, `PROFESSIONAL_SKILLS`, `COMPANY`, `COLLEGE`, `HIGH_SCHL`, `ABOUT_ME`, `CURR_CITY`, `PHONE`) VALUES (NULL, NEW.ROW_ID, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'You are Born', '1988-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Moved to Bangalore, India', '1990-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Walked Your First Step', '1991-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'First Day of Pre Nursary', '1992-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Started Primary School', '1994-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Started College at San Jose State University', '2004-10-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Moved to San Jose, California', '2004-10-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Started Work at Tech Mahindra', '2006-10-13 00:00:00');
 INSERT INTO `SocialMediaPrototypeDB`.`LIFE_EVENTS` (`ROW_ID`, `USER_ID`, `EVENT_NAME`, `DATE`) VALUES (NULL, NEW.ROW_ID, 'Quit Work at Tech Mahindra', '2011-10-13 00:00:00');
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `USER_DETAILS`
--

CREATE TABLE IF NOT EXISTS `USER_DETAILS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `HOME_ADDR` varchar(500) COLLATE ascii_bin NOT NULL,
  `WEB_URL` varchar(150) COLLATE ascii_bin NOT NULL,
  `PROFESSIONAL_SKILLS` varchar(200) COLLATE ascii_bin NOT NULL,
  `COMPANY` varchar(100) COLLATE ascii_bin NOT NULL,
  `COLLEGE` varchar(100) COLLATE ascii_bin NOT NULL,
  `HIGH_SCHL` varchar(100) COLLATE ascii_bin NOT NULL,
  `ABOUT_ME` varchar(1000) COLLATE ascii_bin NOT NULL,
  `CURR_CITY` varchar(100) COLLATE ascii_bin NOT NULL,
  `PHONE` varchar(30) COLLATE ascii_bin NOT NULL,
  PRIMARY KEY (`ROW_ID`),
  KEY `USER_ID` (`USER_ID`),
  KEY `USER_ID_2` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=5 ;

--
-- Dumping data for table `USER_DETAILS`
--

INSERT INTO `USER_DETAILS` (`ROW_ID`, `USER_ID`, `HOME_ADDR`, `WEB_URL`, `PROFESSIONAL_SKILLS`, `COMPANY`, `COLLEGE`, `HIGH_SCHL`, `ABOUT_ME`, `CURR_CITY`, `PHONE`) VALUES
(1, 63, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/rakshithkhatwar', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(2, 64, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/rakshithkhatwar', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(3, 72, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(4, 73, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `FRIENDS_LIST`
--
ALTER TABLE `FRIENDS_LIST`
  ADD CONSTRAINT `User PK Ref 1` FOREIGN KEY (`USER2`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User PK Ref 2` FOREIGN KEY (`USER1`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `GROUP_USERS`
--
ALTER TABLE `GROUP_USERS`
  ADD CONSTRAINT `GROUPS PK REL` FOREIGN KEY (`GROUP_ID`) REFERENCES `GROUPS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `USER PK REL` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `LIFE_EVENTS`
--
ALTER TABLE `LIFE_EVENTS`
  ADD CONSTRAINT `User PK Rela` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `NEWSFEEDS`
--
ALTER TABLE `NEWSFEEDS`
  ADD CONSTRAINT `User table PK relation` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `USER_DETAILS`
--
ALTER TABLE `USER_DETAILS`
  ADD CONSTRAINT `USER PK CONST` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ROW_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
