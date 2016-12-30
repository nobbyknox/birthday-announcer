CREATE TABLE `Birthdays` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `day` int(11) NOT NULL,
    `month` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Birthdays_day` (`day`),
    KEY `Birthdays_month` (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
