-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 16, 2020 at 03:28 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodelogin`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` bigint(35) NOT NULL,
  `username` varchar(50) NOT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `sdt` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `fullname`, `password`, `email`, `sdt`) VALUES
(2, 'nguyenquyphuc', 'nguyen quy phuc ', '1', 'nguyenquyphuc1591999@gmail.com', 337768570),
(10, 'phucnq', 'me oi con yeu bo me1', '12', 'nguyenthithuan1591999@gmail.com', 33776857004),
(16, 'quy duc', 'quy duc con yeu bo', '1', 'nguyenquyduc1591999@gmail.com', 12312343),
(19, 'test', 'test', '123456', 'test1@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_FB`
--

CREATE TABLE `accounts_FB` (
  `id` bigint(20) NOT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `background`
--

CREATE TABLE `background` (
  `id` bigint(20) NOT NULL,
  `id_background` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `background`
--

INSERT INTO `background` (`id`, `id_background`) VALUES
(1, 0),
(2, 2),
(6, 3),
(12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `broad`
--

CREATE TABLE `broad` (
  `id` bigint(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `broadName` varchar(50) NOT NULL,
  `favourite` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `broad`
--

INSERT INTO `broad` (`id`, `email`, `broadName`, `favourite`) VALUES
(1, 'nguyenquyduc1591999@gmail.com', 'ML-intership', 1),
(1, 'nguyenquyphuc1591999@gmail.com', 'ML-intership', 1),
(1, 'nguyenthithuan1591999@gmail.com', 'ML-intership', 1),
(2, 'nguyenquyduc1591999@gmail.com', 'ML-intership_1', 1),
(2, 'nguyenquyphuc1591999@gmail.com', 'ML-intership_1', 1),
(2, 'nguyenthithuan1591999@gmail.com', 'ML-intership_1', 1),
(3, 'nguyenquyphuc1591999@gmail.com', 'Học tiếng anh', 1),
(4, 'nguyenquyphuc1591999@gmail.com', 'Học tiếng nhật', 0),
(6, 'nguyenthithuan1591999@gmail.com', 'Đồ án tốt nghiệp cử nhân', 1),
(13, 'nguyenthithuan1591999@gmail.com', 'test', 0),
(14, 'nguyenthithuan1591999@gmail.com', 'as', 0),
(15, 'nguyenthithuan1591999@gmail.com', 'Đồ án tốt nghiệp kĩ sư', 1),
(19, 'nguyenthithuan1591999@gmail.com', 'assddd', 0),
(20, 'nguyenquyduc1591999@gmail.com', 'Đồ án tốt nghiệp cử nhân', 0);

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `id_card` bigint(20) NOT NULL,
  `text_card` varchar(200) NOT NULL,
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`id_card`, `text_card`, `id`) VALUES
(1, 'Machine learning 123', 115),
(1, 'deep learning', 116),
(1, 'Machine learning', 117),
(1, 'ML', 118),
(1, 'ML', 119),
(2, 'Học tiếng anh', 126),
(2, 'Học ngữ pháp tiếng anh', 127),
(2, 'Học tiếng trung', 128),
(3, 'Học bảng chữ cái', 129),
(2, 'Hoc ngữ pháp', 130),
(3, 'Luyện nghe', 131),
(16, 'Luyện đọc', 132),
(4, 'Học machine learning cơ bản', 133),
(17, 'Luyện nghe tiếng nhật', 134);

-- --------------------------------------------------------

--
-- Table structure for table `check_list`
--

CREATE TABLE `check_list` (
  `id` bigint(20) NOT NULL,
  `checklist_name` varchar(100) NOT NULL,
  `tick` varchar(100) NOT NULL,
  `id_checklist` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `check_list`
--

INSERT INTO `check_list` (`id`, `checklist_name`, `tick`, `id_checklist`) VALUES
(115, 'test', 'checked', 1),
(115, 'home', ' ', 2),
(115, 'as', 'checked', 3),
(116, 'cơ bản', ' ', 4),
(126, 'Chương 1', '', 5),
(118, 'cơ bản', '', 6),
(133, 'KNN', 'checked', 7),
(133, 'Phân cụm', 'checked', 8),
(133, 'Hồi quy tuyến tính', 'checked', 9),
(133, 'CNN', ' ', 14),
(133, 'CNN', ' ', 15),
(133, 'CNN', ' ', 16),
(133, 'CNN', ' ', 17),
(115, 'CNN', ' ', 18),
(115, 'CNN', ' ', 19);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `text_comment` text NOT NULL,
  `id_comment` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `detail_card`
--

CREATE TABLE `detail_card` (
  `id` bigint(20) NOT NULL,
  `description` longtext NOT NULL,
  `start` text DEFAULT NULL,
  `end` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `detail_card`
--

INSERT INTO `detail_card` (`id`, `description`, `start`, `end`) VALUES
(115, 'anh yêu em rất nhiều\nGối ạ', '2020-12-14 22:56', '2020-12-16 22:56'),
(116, 'Click to write a description...', '2020-12-14 23:08', '2020-12-16 23:08'),
(117, 'Click to write a description...', '2020-12-15 09:25', '2020-12-31 09:25'),
(118, 'Click to write a description...', '2020-12-31 09:25', '2021-01-28 09:25'),
(119, 'Click to write a description...', '2020-12-15 09:25', '2020-12-31 09:25'),
(126, 'Click to write a description...', '2020-12-19 23:15', '2020-12-31 23:15'),
(127, 'Click to write a description...', '2020-12-15 09:26', '2020-12-31 09:26'),
(128, 'Click to write a description...', '2020-12-16 09:26', '2020-12-31 09:26'),
(129, 'Click to write a description...', '2020-12-14 23:15', '2020-12-17 23:15'),
(130, 'Click to write a description...', '2020-12-15 11:22', '2020-12-31 11:22'),
(131, 'Click to write a description...', '2020-12-16 09:26', '2020-12-31 09:26'),
(132, 'Click to write a description...', '2020-12-16 09:26', '2020-12-31 09:26'),
(133, 'Click to write a description...', '2020-12-15 10:35', '2020-12-31 10:35'),
(134, 'Nghe bảng chữ cái ở trên youtobe', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `member_card`
--

CREATE TABLE `member_card` (
  `id` bigint(20) NOT NULL,
  `username` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member_card`
--

INSERT INTO `member_card` (`id`, `username`) VALUES
(115, 'phucnq');

-- --------------------------------------------------------

--
-- Table structure for table `title`
--

CREATE TABLE `title` (
  `id` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `id_card` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `title`
--

INSERT INTO `title` (`id`, `title`, `id_card`) VALUES
(1, 'Todo1', 1),
(1, 'Doing', 2),
(1, 'Done', 3),
(2, 'Doing', 4),
(2, 'Todo', 5),
(3, 'học tiếng pháp', 6),
(3, 'học tiếng đức', 7),
(4, 'Học lập trình python cơ bản', 8),
(4, 'Học lập trình nodejs cơ bản', 9),
(4, 'học lập trình C#', 10),
(3, 'hoc tieng thai lan', 13),
(1, 'Học tiếng Nhật', 16),
(1, 'Học tiếng Nhật', 17),
(2, 'Done', 18),
(1, 'hoc tieng thai lan', 19),
(2, 'Bài tập lớn môn công nghệ web', 20),
(2, 'Bài tập lớn deeplearning', 21),
(3, 'Bảng chữ cái', 22),
(3, 'ngữ âm', 23),
(3, 'ngữ pháp', 24),
(3, 'Done', 25),
(4, 'Lập trình frontend cơ bản', 26),
(4, 'Học lập trình java cơ bản', 27),
(1, 'Học tiếng Hàn', 28),
(1, 'hoc tieng thai lan', 48),
(14, 'as', 75),
(14, 'as', 85),
(14, 'as', 86),
(14, 'as', 87),
(14, 'sàd', 88),
(14, 'sa', 89),
(14, 'sf', 90),
(6, 'as', 91),
(6, 'af', 92),
(6, 'dc', 93),
(13, 'ad', 94),
(13, 'a', 95),
(15, 'as', 96);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`,`email`);

--
-- Indexes for table `background`
--
ALTER TABLE `background`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `broad`
--
ALTER TABLE `broad`
  ADD PRIMARY KEY (`id`,`email`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `check_list`
--
ALTER TABLE `check_list`
  ADD PRIMARY KEY (`id_checklist`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id_comment`);

--
-- Indexes for table `detail_card`
--
ALTER TABLE `detail_card`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member_card`
--
ALTER TABLE `member_card`
  ADD PRIMARY KEY (`id`,`username`);

--
-- Indexes for table `title`
--
ALTER TABLE `title`
  ADD PRIMARY KEY (`id_card`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` bigint(35) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `broad`
--
ALTER TABLE `broad`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `check_list`
--
ALTER TABLE `check_list`
  MODIFY `id_checklist` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id_comment` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `title`
--
ALTER TABLE `title`
  MODIFY `id_card` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
