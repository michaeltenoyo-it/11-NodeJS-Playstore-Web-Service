-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2020 at 08:20 PM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appmonsta`
--
CREATE DATABASE IF NOT EXISTS `appmonsta` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `appmonsta`;

-- --------------------------------------------------------

--
-- Table structure for table `dislike_post`
--

DROP TABLE IF EXISTS `dislike_post`;
CREATE TABLE IF NOT EXISTS `dislike_post` (
  `id_dislike` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id_dislike`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `history_vote`
--

DROP TABLE IF EXISTS `history_vote`;
CREATE TABLE IF NOT EXISTS `history_vote` (
  `email_voter` varchar(50) NOT NULL,
  `id_list_vote` int(10) NOT NULL,
  `indeks_pilihan_vote` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history_vote`
--

INSERT INTO `history_vote` (`email_voter`, `id_list_vote`, `indeks_pilihan_vote`) VALUES
('popo.com', 18, 2);

-- --------------------------------------------------------

--
-- Table structure for table `like_post`
--

DROP TABLE IF EXISTS `like_post`;
CREATE TABLE IF NOT EXISTS `like_post` (
  `id_like` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id_like`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `like_rating`
--

DROP TABLE IF EXISTS `like_rating`;
CREATE TABLE IF NOT EXISTS `like_rating` (
  `likeID` int(11) NOT NULL AUTO_INCREMENT,
  `ratingID` int(11) NOT NULL,
  `like_indicator` tinyint(1) NOT NULL,
  `comment` text NOT NULL,
  `email` text NOT NULL,
  PRIMARY KEY (`likeID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `list_vote`
--

DROP TABLE IF EXISTS `list_vote`;
CREATE TABLE IF NOT EXISTS `list_vote` (
  `id_list_vote` int(11) NOT NULL AUTO_INCREMENT,
  `judul_vote` varchar(255) NOT NULL,
  `email_pembuat` varchar(50) NOT NULL,
  PRIMARY KEY (`id_list_vote`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `list_vote`
--

INSERT INTO `list_vote` (`id_list_vote`, `judul_vote`, `email_pembuat`) VALUES
(17, 'Anime greatest hits', 'mike.com'),
(18, '2020 greatest hits', 'popo.com');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `total_up` int(11) DEFAULT NULL,
  `total_down` int(11) DEFAULT NULL,
  `tgl_post` date NOT NULL,
  `judul_post` varchar(50) NOT NULL,
  `caption_post` varchar(255) DEFAULT NULL,
  `img_path` text,
  `app_id` text,
  PRIMARY KEY (`id_post`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id_post`, `email`, `total_up`, `total_down`, `tgl_post`, `judul_post`, `caption_post`, `img_path`, `app_id`) VALUES
(30, 'ming@gmail.com', 0, 0, '2020-05-31', 'Vote This Girl!', 'Youngest miss universe 2020', 'none', 'com.missuniverse.app');

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
CREATE TABLE IF NOT EXISTS `rating` (
  `ratingID` int(11) NOT NULL AUTO_INCREMENT,
  `appID` text NOT NULL,
  `rating` int(2) NOT NULL,
  `comment` text NOT NULL,
  `rating_date` date NOT NULL,
  `email` text NOT NULL,
  PRIMARY KEY (`ratingID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `review_post`
--

DROP TABLE IF EXISTS `review_post`;
CREATE TABLE IF NOT EXISTS `review_post` (
  `id_review` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `comment` varchar(1000) NOT NULL,
  `tgl_review` date NOT NULL,
  PRIMARY KEY (`id_review`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `review_post`
--

INSERT INTO `review_post` (`id_review`, `id_post`, `comment`, `tgl_review`) VALUES
(6, 30, 'Komen3123', '2020-05-31');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `username` text NOT NULL,
  `password` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `tipe_user` int(5) NOT NULL,
  `profile_picture` varchar(50) NOT NULL,
  `api_hit` int(11) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `email`, `tipe_user`, `profile_picture`, `api_hit`) VALUES
('ike', '123', 'mike.com', 1, 'default.jpg', 5),
('mik', '321', 'mike@mail.com', 1, 'mike@mail.com.jpg', 5),
('ming', 'ming123', 'ming@gmail.com', 2, '', 5),
('mitchell', 'mitchell', 'mitchell@gmail.com', 2, 'blablabla', 5),
('popo', '1234', 'popo.com', 1, 'default.jpg', 5);

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
CREATE TABLE IF NOT EXISTS `vote` (
  `id_list_vote` int(5) NOT NULL,
  `indeks_pilihan_vote` int(10) NOT NULL,
  `id_app` varchar(50) NOT NULL,
  `nama_app` varchar(100) NOT NULL,
  `publisher_name` varchar(50) NOT NULL,
  `app_type` varchar(50) NOT NULL,
  `genre` varchar(50) NOT NULL,
  `Jumlah_vote` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vote`
--

INSERT INTO `vote` (`id_list_vote`, `indeks_pilihan_vote`, `id_app`, `nama_app`, `publisher_name`, `app_type`, `genre`, `Jumlah_vote`) VALUES
(17, 1, 'com.hazelfunstudio.icecream.donut.maker', 'Ice Cream Donuts Maker: Dessert Cooking Games', 'Hazel Fun Studio', 'GAME', 'Role Playing', 0),
(17, 2, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0),
(18, 1, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0),
(18, 2, 'com.smcim.stalphonsamulapra', 'ST.ALPHONSA CHURCH,MULAPRA', 'tellicherryarchdiocese', 'APPLICATION', 'Communication', 1);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE IF NOT EXISTS `wishlist` (
  `email` text NOT NULL,
  `app_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
