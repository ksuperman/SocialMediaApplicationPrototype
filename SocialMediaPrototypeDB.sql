-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 12, 2015 at 09:30 AM
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
CREATE DATABASE IF NOT EXISTS `SocialMediaPrototypeDB` DEFAULT CHARACTER SET ascii COLLATE ascii_bin;
USE `SocialMediaPrototypeDB`;

-- --------------------------------------------------------

--
-- Table structure for table `FRIENDS_LIST`
--
-- Creation: Oct 03, 2015 at 03:14 AM
--

DROP TABLE IF EXISTS `FRIENDS_LIST`;
CREATE TABLE IF NOT EXISTS `FRIENDS_LIST` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER1` bigint(20) NOT NULL,
  `USER2` bigint(20) NOT NULL,
  `ACCEPTED` varchar(10) COLLATE ascii_bin NOT NULL DEFAULT 'N',
  PRIMARY KEY (`ROW_ID`),
  KEY `USER1` (`USER1`,`USER2`),
  KEY `USER2` (`USER2`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=73 ;

--
-- Dumping data for table `FRIENDS_LIST`
--

INSERT INTO `FRIENDS_LIST` (`ROW_ID`, `USER1`, `USER2`, `ACCEPTED`) VALUES
(2, 63, 65, 'N'),
(3, 63, 66, 'N'),
(4, 63, 68, 'N'),
(6, 63, 67, 'N'),
(9, 69, 64, 'N'),
(36, 70, 64, 'N'),
(37, 70, 63, 'Y'),
(38, 63, 70, 'Y'),
(40, 73, 64, 'N'),
(41, 63, 71, 'N'),
(44, 74, 63, 'N'),
(45, 74, 64, 'N'),
(46, 63, 64, 'N'),
(47, 63, 72, 'N'),
(48, 78, 63, 'Y'),
(49, 63, 78, 'Y'),
(50, 80, 63, 'Y'),
(51, 80, 78, 'N'),
(52, 80, 64, 'N'),
(53, 81, 63, 'N'),
(54, 81, 78, 'N'),
(57, 63, 73, 'N'),
(58, 63, 79, 'N'),
(60, 82, 78, 'N'),
(61, 82, 80, 'N'),
(62, 82, 81, 'N'),
(64, 63, 82, 'Y'),
(65, 82, 63, 'Y'),
(66, 63, 80, 'Y'),
(67, 63, 75, 'N'),
(68, 83, 63, 'N'),
(69, 83, 78, 'N'),
(70, 83, 81, 'N'),
(71, 83, 80, 'N'),
(72, 83, 82, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `GROUPS`
--
-- Creation: Oct 04, 2015 at 09:33 PM
--

DROP TABLE IF EXISTS `GROUPS`;
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
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=12 ;

--
-- Dumping data for table `GROUPS`
--

INSERT INTO `GROUPS` (`ROW_ID`, `GROUP_NAME`, `GROUP_INFO`, `IMAGE_URL`, `CREATED_BY`) VALUES
(5, 'Car Freaks !!', 'This Group is for Car owner in the Bay Area.', '/images/group_thumbnail.jpg', 63),
(6, 'Aftermarket Car mods', 'This group is for the discussion of Aftermarket car modification in the Bay area', '/images/group_thumbnail.jpg', 63),
(7, 'Transformer', 'Secret Group of Transformers', '/images/group_thumbnail.jpg', 81),
(8, 'CMPE 273 Project', 'Discussion Group for the Project work of CMPE 273', '/images/group_thumbnail.jpg', 63),
(9, 'Google Internship !!', 'All the Information Required for Interning at google at one place.', '/images/group_thumbnail.jpg', 63),
(11, 'Fantastic Four', 'Super Hero Club !!!', '/images/group_thumbnail.jpg', 83);

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
-- Creation: Oct 04, 2015 at 06:07 PM
--

DROP TABLE IF EXISTS `GROUP_USERS`;
CREATE TABLE IF NOT EXISTS `GROUP_USERS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `GROUP_ID` bigint(100) NOT NULL,
  `USER_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`ROW_ID`),
  KEY `GROUP_ID` (`GROUP_ID`,`USER_ID`),
  KEY `GROUP_ID_2` (`GROUP_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=48 ;

--
-- Dumping data for table `GROUP_USERS`
--

INSERT INTO `GROUP_USERS` (`ROW_ID`, `GROUP_ID`, `USER_ID`) VALUES
(40, 5, 63),
(42, 5, 69),
(47, 5, 78),
(14, 5, 80),
(15, 5, 81),
(22, 5, 82),
(44, 6, 63),
(35, 7, 63),
(36, 7, 78),
(16, 7, 81),
(24, 8, 63),
(38, 9, 63),
(46, 11, 63),
(45, 11, 83);

-- --------------------------------------------------------

--
-- Table structure for table `LIFE_EVENTS`
--
-- Creation: Oct 04, 2015 at 07:43 AM
--

DROP TABLE IF EXISTS `LIFE_EVENTS`;
CREATE TABLE IF NOT EXISTS `LIFE_EVENTS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `EVENT_NAME` varchar(500) COLLATE ascii_bin NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ROW_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=112 ;

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
(23, 73, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(24, 74, 'You are Born', '1988-08-13 07:00:00'),
(25, 74, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(26, 74, 'Walked Your First Step', '1991-08-13 07:00:00'),
(27, 74, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(28, 74, 'Started Primary School', '1994-08-13 07:00:00'),
(29, 74, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(30, 74, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(31, 74, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(32, 74, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(33, 74, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(34, 74, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(35, 75, 'You are Born', '1988-08-13 07:00:00'),
(36, 75, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(37, 75, 'Walked Your First Step', '1991-08-13 07:00:00'),
(38, 75, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(39, 75, 'Started Primary School', '1994-08-13 07:00:00'),
(40, 75, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(41, 75, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(42, 75, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(43, 75, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(44, 75, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(45, 75, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(46, 78, 'You are Born', '1988-08-13 07:00:00'),
(47, 78, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(48, 78, 'Walked Your First Step', '1991-08-13 07:00:00'),
(49, 78, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(50, 78, 'Started Primary School', '1994-08-13 07:00:00'),
(51, 78, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(52, 78, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(53, 78, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(54, 78, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(55, 78, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(56, 78, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(57, 79, 'You are Born', '1988-08-13 07:00:00'),
(58, 79, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(59, 79, 'Walked Your First Step', '1991-08-13 07:00:00'),
(60, 79, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(61, 79, 'Started Primary School', '1994-08-13 07:00:00'),
(62, 79, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(63, 79, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(64, 79, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(65, 79, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(66, 79, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(67, 79, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(68, 80, 'You are Born', '1988-08-13 07:00:00'),
(69, 80, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(70, 80, 'Walked Your First Step', '1991-08-13 07:00:00'),
(71, 80, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(72, 80, 'Started Primary School', '1994-08-13 07:00:00'),
(73, 80, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(74, 80, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(75, 80, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(76, 80, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(77, 80, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(78, 80, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(79, 81, 'You are Born', '1988-08-13 07:00:00'),
(80, 81, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(81, 81, 'Walked Your First Step', '1991-08-13 07:00:00'),
(82, 81, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(83, 81, 'Started Primary School', '1994-08-13 07:00:00'),
(84, 81, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(85, 81, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(86, 81, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(87, 81, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(88, 81, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(89, 81, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(90, 82, 'You are Born', '1988-08-13 07:00:00'),
(91, 82, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(92, 82, 'Walked Your First Step', '1991-08-13 07:00:00'),
(93, 82, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(94, 82, 'Started Primary School', '1994-08-13 07:00:00'),
(95, 82, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(96, 82, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(97, 82, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(98, 82, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(99, 82, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(100, 82, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00'),
(101, 83, 'You are Born', '1988-08-13 07:00:00'),
(102, 83, 'Moved to Bangalore, India', '1990-08-13 07:00:00'),
(103, 83, 'Walked Your First Step', '1991-08-13 07:00:00'),
(104, 83, 'First Day of Pre Nursary', '1992-08-13 07:00:00'),
(105, 83, 'Started Primary School', '1994-08-13 07:00:00'),
(106, 83, 'Started High School at Sri Cadambi Vidya Kendra', '1998-08-13 07:00:00'),
(107, 83, 'Graduated High School at Sri Cadambi Vidya Kendra', '2004-08-13 07:00:00'),
(108, 83, 'Started College at San Jose State University', '2004-10-13 07:00:00'),
(109, 83, 'Moved to San Jose, California', '2004-10-13 07:00:00'),
(110, 83, 'Started Work at Tech Mahindra', '2006-10-13 07:00:00'),
(111, 83, 'Quit Work at Tech Mahindra', '2011-10-13 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `NEWSFEEDS`
--
-- Creation: Oct 02, 2015 at 07:49 PM
--

DROP TABLE IF EXISTS `NEWSFEEDS`;
CREATE TABLE IF NOT EXISTS `NEWSFEEDS` (
  `ROW_ID` bigint(100) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL COMMENT 'Forign key to Users Table',
  `POST_MESSAGE` varchar(1000) COLLATE ascii_bin DEFAULT NULL,
  `IMAGE_URL` varchar(500) COLLATE ascii_bin NOT NULL COMMENT 'Rakshith Koravadi Hatwar',
  `TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ROW_ID`),
  KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=35 ;

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
(24, 63, 'This is my Latest Post !! :) All is well :D', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-04 22:21:53'),
(25, 63, 'This is new News feded', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-06 00:29:04'),
(26, 74, 'My Batman Movie is Awesome :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-09 07:36:21'),
(27, 78, 'Optimus Prime Says hello to Earth !!', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-09 17:26:24'),
(28, 81, 'Time to Transform !!! ;)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-10 01:09:15'),
(29, 63, 'Testing the Sanity of the Application', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-11 00:10:43'),
(30, 63, 'Testing DB Connection Pooling :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-11 08:46:01'),
(31, 82, 'This week We are playing at the Levis'' Stadium !! Please come and enjoy the Show :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-11 08:55:23'),
(33, 63, 'Sanity Testing :) Everything is A Ok :) :P', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-12 04:08:36'),
(34, 83, 'Fantastic Four is having an opening :)', 'https://lh3.googleusercontent.com/-uoFDBGmaJME/AAAAAAAAAAI/AAAAAAAAAAA/QcZsAAou26Q/photo.jpg', '2015-10-12 04:29:06');

-- --------------------------------------------------------

--
-- Table structure for table `USERS`
--
-- Creation: Oct 02, 2015 at 10:15 PM
--

DROP TABLE IF EXISTS `USERS`;
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
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=84 ;

--
-- Dumping data for table `USERS`
--

INSERT INTO `USERS` (`ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`, `PASSWORD`, `GENDER`, `IMAGE_URL`) VALUES
(63, 'Rakshith', 'Hatwar', 'rakshithk@live.com', '1333-12-13', '$2a$10$CbSe14VfcKWaZItB2tuT7ukkwWMt7a7flT.LzIi.W4mSZfqt0dGS6', 'male', '/public/uploads/976867.jpg'),
(64, 'Rakshith', 'Hatwar', 'ksuperman@gmail.com', '1988-08-13', '$2a$10$YynR3HXt.HQ8alPKEpGjue6kzD9Wx/cnn3uP4XwzsWO2fcryNUUdK', 'male', '/images/profile-photo_default.jpg'),
(65, 'Kevin', 'Scott', 'kevinscott@gmail.com', '2005-08-13', '$2a$10$R3Vx.fXPUHR9nmxTLqR.AOhcTLalG9lMCjqM1huuoYHtwpDemp/nq', 'male', '/images/profile-photo_default.jpg'),
(66, 'Rob', 'Thomas', 'robthomas@gmail.com', '1990-09-18', '$2a$10$zfev7l7EhRdGTmROr6K1rOgjMdUJSgO9IdYMK1iNANUK3IrbUfKSW', 'male', '/images/profile-photo_default.jpg'),
(67, 'David', 'Blain', 'Davidblain@friendscircle.com', '2011-02-08', '$2a$10$nc.X8FTyOGm2VqRXF5LZteOjSD62qVPIp3LyHVZODYoKz.72uORWy', 'male', '/images/profile-photo_default.jpg'),
(68, 'Mike', 'Myers', 'mike@gmail.com', '1988-12-13', '$2a$10$YARbaX6ijraEKiuU/9F9lOQzbcKdxzBBAmGYWjCLTqsX5BEz5oVxq', 'male', '/images/profile-photo_default.jpg'),
(69, 'Bob ', 'Marley', 'bobm@gmail.com', '1967-12-13', '$2a$10$yd2btDzGcQeNEP32JLQv.u0/mZLTPbZ3BFD4cOoh/oEnzE1vwVivS', 'male', '/images/profile-photo_default.jpg'),
(70, 'James', 'Camaroon', 'jamesc@gmail.com', '2001-12-13', '$2a$10$6VkHdUs54B5e/NVj3G96FeqdeE/xRXj1TtpHdpeaxK3H7/Zrx0pT.', 'male', '/images/profile-photo_default.jpg'),
(71, 'James', 'Bond', 'jamesb@gmail.com', '1985-09-18', '$2a$10$HXrZVMhOmh/CMz4d7j05lOygfZ2TthWnGbrrI8WTXhMu5W27dzK9W', 'male', '/images/profile-photo_default.jpg'),
(72, 'Peter', 'Parker', 'spidey@gmail.com', '1982-09-18', '$2a$10$O85QW6QxLNIZCNnqx9F/Ke1U4nmcdbZwNceO.lb72tn1NM8848NmC', 'male', '/images/profile-photo_default.jpg'),
(73, 'Eric', 'Lencher', 'eric@gmail.com', '1920-09-15', '$2a$10$GdSQy.8k5e5G5JwXssUaDezUJc2PdWZrVK3loB.urIaPrcbAM9XTu', 'male', '/images/profile-photo_default.jpg'),
(74, 'Christopher', 'Nolan', 'cnolan@gmail.com', '1956-01-01', '$2a$10$irkvyU3ml7242VWYGRXOMeshsKF6s43rE1mdIsFLN0dCD1dsuyO7S', 'male', '/images/profile-photo_default.jpg'),
(75, 'Kapil', 'Dev', 'kapil@gmail.com', '1956-01-01', '$2a$10$rTPoR17EoiXyfqO539dYwu1oBQOBn.s7YzqvJQn5mzwq9.URq4Lki', 'male', '/images/profile-photo_default.jpg'),
(78, 'Optimus', 'Prime', 'optp@gmail.com', '2014-01-01', '$2a$10$2YgoufCLDblxMXtsvUd1NuFUTFHAkaog16RKv1d3.J2NpAY234v8G', 'male', '/public/uploads/906105-optimus.jpg'),
(79, 'Rakshith', 'Hatwar', 'ksuperma1n@gmail.com', '2014-01-01', '$2a$10$GLGBDatXBKFmzaVu2fchn.g6hylA4/TJ5L5Z6A/xEpig5bID/0n7K', 'male', '/images/profile-photo_default.jpg'),
(80, 'Peter', 'Pan', 'peterp@gmail.com', '2010-01-01', '$2a$10$eDuR6Y3Nas13MnqorYfKiOPokBgOAPT8RlHKCwmrac0SckPbw0VCW', 'male', '/public/uploads/Peter-Pan-icon.png'),
(81, 'Bumble', 'Bee', 'bumbleb@gmail.com', '2012-02-01', '$2a$10$8F22cSCAxqoTwbQU7aniL.YgMTpEqvU2jTWb6KZIbe7DfEOKyzC0K', 'male', '/public/uploads/bumble-bee-transformers-.jpg'),
(82, 'Linkin', 'Park', 'lp@gmail.com', '2010-01-01', '$2a$10$y0j4MuntCzJo3Sg8ZG7a3..AB20J..rNjylt0AD2CyV33hG7cQLeS', 'male', '/images/profile-photo_default.jpg'),
(83, 'Reed', 'Richards', 'rrichards@gmail.com', '2015-01-01', '$2a$10$W6b4QJXTFsyuMD/gC0I5uefV1hirCtena/iQdncuZuEJcPqdRfmwC', 'male', '/images/profile-photo_default.jpg');

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
-- Creation: Oct 04, 2015 at 06:51 AM
--

DROP TABLE IF EXISTS `USER_DETAILS`;
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
) ENGINE=InnoDB  DEFAULT CHARSET=ascii COLLATE=ascii_bin AUTO_INCREMENT=14 ;

--
-- Dumping data for table `USER_DETAILS`
--

INSERT INTO `USER_DETAILS` (`ROW_ID`, `USER_ID`, `HOME_ADDR`, `WEB_URL`, `PROFESSIONAL_SKILLS`, `COMPANY`, `COLLEGE`, `HIGH_SCHL`, `ABOUT_ME`, `CURR_CITY`, `PHONE`) VALUES
(1, 63, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/rakshithkhatwar', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(2, 64, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/rakshithkhatwar', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(3, 72, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(4, 73, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(5, 74, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(6, 75, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(7, 78, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(8, 79, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(9, 80, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(10, 81, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(11, 82, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(12, 70, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/rakshithkhatwar', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890'),
(13, 83, '817 N 10th Street Apt 117', 'https://www.linkedin.com/in/XXXXX', 'Android - Java - JavaScript - Objective-C/Temp - Siebel', 'Cognizant', 'San Jose State University', 'Sri Cadambi Vidya Kendra', 'two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine', 'San Jose,California', '(669)-247-8890');

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
