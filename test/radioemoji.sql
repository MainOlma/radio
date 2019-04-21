/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Дамп структуры для таблица radioemoji.counters
CREATE TABLE IF NOT EXISTS `counters` (
  `id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Дамп данных таблицы radioemoji.counters: ~7 rows (приблизительно)
/*!40000 ALTER TABLE `counters` DISABLE KEYS */;
INSERT INTO `counters` (`id`, `count`, `name`) VALUES
	(1, 0, 'useful'),
	(2, 0, 'love'),
	(3, 0, 'omg'),
	(4, 0, 'cry'),
	(5, 0, 'fun'),
	(6, 0, 'sick'),
	(7, 0, 'angry');
/*!40000 ALTER TABLE `counters` ENABLE KEYS */;

-- Дамп структуры для таблица radioemoji.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fingerprint` varchar(100) NOT NULL,
  `emoji` varchar(100) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8;

-- Дамп данных таблицы radioemoji.users: ~16 rows (приблизительно)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
