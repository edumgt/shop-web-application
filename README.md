-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.5.26-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- food 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `food` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `food`;

-- 테이블 food.email_confirmation_token 구조 내보내기
CREATE TABLE IF NOT EXISTS `email_confirmation_token` (
  `token_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`token_id`),
  KEY `FK1nn2s9fe9dn1ive1wd0y99utv` (`user_id`),
  CONSTRAINT `FK1nn2s9fe9dn1ive1wd0y99utv` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.email_confirmation_token:~0 rows (대략적) 내보내기

-- 테이블 food.meals 구조 내보내기
CREATE TABLE IF NOT EXISTS `meals` (
  `meal_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(250) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`meal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.meals:~0 rows (대략적) 내보내기

-- 테이블 food.orders 구조 내보내기
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.orders:~0 rows (대략적) 내보내기

-- 테이블 food.order_meal 구조 내보내기
CREATE TABLE IF NOT EXISTS `order_meal` (
  `meal_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`meal_id`,`order_id`),
  KEY `FK7h0r8f1gtutdwa1rhagh06x93` (`order_id`),
  CONSTRAINT `FK1yvbno5g32ogkngct94y8y0gd` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`),
  CONSTRAINT `FK7h0r8f1gtutdwa1rhagh06x93` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.order_meal:~0 rows (대략적) 내보내기

-- 테이블 food.order_restaurant 구조 내보내기
CREATE TABLE IF NOT EXISTS `order_restaurant` (
  `order_id` bigint(20) NOT NULL,
  `restaurant_id` bigint(20) NOT NULL,
  PRIMARY KEY (`order_id`,`restaurant_id`),
  KEY `FK358j86h78ncxk3ai0ugng2063` (`restaurant_id`),
  CONSTRAINT `FK358j86h78ncxk3ai0ugng2063` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`),
  CONSTRAINT `FKjp01o1dxni77938fqwnnh7agp` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.order_restaurant:~0 rows (대략적) 내보내기

-- 테이블 food.order_status 구조 내보내기
CREATE TABLE IF NOT EXISTS `order_status` (
  `order_id` bigint(20) NOT NULL,
  `status_id` bigint(20) NOT NULL,
  `date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`order_id`,`status_id`),
  KEY `FKs8f9s66vmbenpm548ymtiw4j8` (`status_id`),
  CONSTRAINT `FK48efngdcgl1e9tkfbcalk35gl` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKs8f9s66vmbenpm548ymtiw4j8` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.order_status:~0 rows (대략적) 내보내기

-- 테이블 food.order_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `order_user` (
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`order_id`,`user_id`),
  KEY `FK4rr5n6sfje9w1em7ynp8slrow` (`user_id`),
  CONSTRAINT `FK4rr5n6sfje9w1em7ynp8slrow` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKm7muior2ynl30n8qh9yqembso` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.order_user:~0 rows (대략적) 내보내기

-- 테이블 food.restaurants 구조 내보내기
CREATE TABLE IF NOT EXISTS `restaurants` (
  `restaurant_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(250) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.restaurants:~0 rows (대략적) 내보내기

-- 테이블 food.restaurant_meal 구조 내보내기
CREATE TABLE IF NOT EXISTS `restaurant_meal` (
  `restaurant_id` bigint(20) NOT NULL,
  `meal_id` bigint(20) NOT NULL,
  PRIMARY KEY (`restaurant_id`,`meal_id`),
  KEY `FK7xuwktuj8npc7twfdr1m3fu8w` (`meal_id`),
  CONSTRAINT `FK7xuwktuj8npc7twfdr1m3fu8w` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`meal_id`),
  CONSTRAINT `FKb91043jejuf4v06v1pkndhf71` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.restaurant_meal:~0 rows (대략적) 내보내기

-- 테이블 food.roles 구조 내보내기
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.roles:~3 rows (대략적) 내보내기
INSERT IGNORE INTO `roles` (`role_id`, `name`) VALUES
	(1, 'ROLE_USER'),
	(2, 'ROLE_OWNER'),
	(3, 'ROLE_ADMIN');

-- 테이블 food.statuses 구조 내보내기
CREATE TABLE IF NOT EXISTS `statuses` (
  `status_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.statuses:~6 rows (대략적) 내보내기
INSERT IGNORE INTO `statuses` (`status_id`, `name`) VALUES
	(1, 'PLACED'),
	(2, 'CANCELED'),
	(3, 'PROCESSING'),
	(4, 'IN_ROUTE'),
	(5, 'DELIVERED'),
	(6, 'RECEIVED');

-- 테이블 food.types 구조 내보내기
CREATE TABLE IF NOT EXISTS `types` (
  `type_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.types:~5 rows (대략적) 내보내기
INSERT IGNORE INTO `types` (`type_id`, `name`) VALUES
	(1, 'EMAIL'),
	(2, 'FACEBOOK'),
	(3, 'EMAIL'),
	(4, 'FACEBOOK'),
	(5, 'GOOGLE');

-- 테이블 food.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `blocked` bit(1) DEFAULT b'0',
  `email` varchar(50) DEFAULT NULL,
  `enabled` bit(1) NOT NULL DEFAULT b'0',
  `facebook_token` varchar(250) DEFAULT '',
  `password` varchar(120) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT '',
  `user_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKk8d0f2n7n88w1a16yhua64onx` (`user_name`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.users:~0 rows (대략적) 내보내기

-- 테이블 food.user_restaurant 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_restaurant` (
  `user_id` bigint(20) NOT NULL,
  `restaurant_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`restaurant_id`),
  KEY `FKa8312nnqfryuc1mjin3g3sw4d` (`restaurant_id`),
  CONSTRAINT `FK71krgv2rfl0qimx5cvwqmvuo8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKa8312nnqfryuc1mjin3g3sw4d` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.user_restaurant:~0 rows (대략적) 내보내기

-- 테이블 food.user_role 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKt7e7djp752sqn6w22i6ocqy6q` (`role_id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKt7e7djp752sqn6w22i6ocqy6q` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.user_role:~0 rows (대략적) 내보내기

-- 테이블 food.user_type 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_type` (
  `user_id` bigint(20) NOT NULL,
  `type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`type_id`),
  KEY `FKweqmhl781j658kkq0qom81ru` (`type_id`),
  CONSTRAINT `FKgx1oa4kbhp6v2h4fkcs86782y` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKweqmhl781j658kkq0qom81ru` FOREIGN KEY (`type_id`) REFERENCES `types` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 테이블 데이터 food.user_type:~0 rows (대략적) 내보내기

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
