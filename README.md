# Cornell Rocketry Team Admin Console

This repository holds the source code for the Cornell Rocketry Team's administration console. It is split into two parts, the _client_, which is the part that users see, and the _server_, which handles the back end.

The source code for the client is located in the [`client`](./client) directory, and the source code for the server is located in [this directory](.).


## Server
The server is implemented in the [Go Programming Language](https://go.dev). If you haven't ever written Go before, I'd recommend completing [_A Tour of Go_](https://go.dev/tour). It teaches the fundamentals of Go very well.

The server uses a [MySQL database](https://www.mysql.com/). There are many tutorials online that explain how to configure MySQL online.

The server gets it's configuration information from a `.env` file. It should be in the following format:

```env
DSN=mysqluname:mysqlpw@mysqlserver/mysqldb
CLIENT_ID=something.apps.googleusercontent.com
LOGIN_REDIRECT=serverLocation
SECRET=securelyGeneratedSecret
CORS=clientLocation
```

(Instead of a `.env` file, you can also use environment variables.)

The `DSN` (Data Source Name) explains how the server should connect to the database. It can be in a variety of formats, but the most common is `username:password@server/database`, where `username` and `password` are the MySQL user's username and password, `server` is the location of the server, and `database` is the name of the database.

You also need configure the database. This SQL script will do that for you (I should include this in a better place than the README, but it's here for now):

<details>
<summary>Show SQL script</summary>

```sql
-- -------------------------------------------------------------
-- TablePlus 4.5.2(402)
--
-- https://tableplus.com/
--
-- Database: rocketryadmin
-- Generation Time: 2022-05-09 12:20:06.0090
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `hour_categories`;
CREATE TABLE `hour_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `hours`;
CREATE TABLE `hours` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `hours` float DEFAULT NULL,
  `date` date DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `metGoals` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `subteams`;
CREATE TABLE `subteams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `netId` varchar(8) DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `userLevel` int DEFAULT NULL,
  `subteamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
```

</details>

The `CLIENT_ID` is generated by Google and used for Google Sign In functionality. You can generate one by following [Google's Documentation](https://developers.google.com/identity/gsi/web).

The `LOGIN_REDIRECT` should just be the base url of your server (for example, `https://localhost:3000`). It is used to tell Google Sign In where to redirect the user after they are signed in.

`SECRET` should be a securely generated secret string for signing cookies.

`CORS` should just be the location of the client (for example, `https://localhost:3001`). It is used for [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Client

The client is implemented using [Webpack](https://webpack.js.org), [TypeScript](https://typescriptlang.org) and [React](https://reactjs.org).  It uses [Yarn](https://yarnpkg.com/) to manage dependencies.

Yarn is super easy to use. To install dependencies, run `yarn`. To start a development server, run `yarn start`. If you want to build a production version of the app, run `yarn build:prod` (or `yarn build:dev` for a development version which should not be used in production).

It also uses its own `.env` file, which uses the following format:

```env
CLIENT_ID=something.apps.googleusercontent.com
BASE_URL=serverLocation
```

(Instead of a `.env` file, you can also use environment variables.)


`CLIENT_ID` should be the same as the server's configuration file, and `BASE_URL` should be the server's address (same as the server's `LOGIN_REDIRECT`).

## Conclusion

If you have any questions, you can reach out to me (wb273), or file an issue. Pull requests are greatly appreciated.