-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: groupomania
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comment` (
  `idcomment` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `postId` int(10) unsigned NOT NULL,
  `content` mediumtext NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcomment`),
  KEY `fk_user_idx` (`userId`),
  KEY `fk_post_idx` (`postId`),
  CONSTRAINT `fk_post` FOREIGN KEY (`postId`) REFERENCES `post` (`idpost`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `user` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (2,171,28,'essai de com','2021-03-16 15:56:42'),(6,171,31,'premier essai','2021-03-16 18:48:56'),(17,171,30,'good !!','2021-03-19 00:08:32'),(38,171,25,'essai','2021-03-19 12:29:18'),(44,171,25,'essai2','2021-03-19 12:55:34'),(46,174,25,'good','2021-03-19 13:17:00');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liked`
--

DROP TABLE IF EXISTS `liked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `liked` (
  `idUsers` int(10) unsigned NOT NULL,
  `idPosts` int(10) unsigned NOT NULL,
  KEY `fk_post_like_idx` (`idPosts`),
  KEY `fk_user_like_idx` (`idUsers`),
  CONSTRAINT `fk_post_like` FOREIGN KEY (`idPosts`) REFERENCES `post` (`idpost`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_like` FOREIGN KEY (`idUsers`) REFERENCES `user` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liked`
--

LOCK TABLES `liked` WRITE;
/*!40000 ALTER TABLE `liked` DISABLE KEYS */;
INSERT INTO `liked` VALUES (171,24),(171,25),(171,26),(171,28),(173,30),(171,31),(174,31),(174,30),(174,32),(174,33),(171,35),(171,33),(171,32),(171,27),(171,45),(173,45);
/*!40000 ALTER TABLE `liked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `post` (
  `idpost` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `content` mediumtext NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `liked` smallint(4) unsigned DEFAULT '0',
  `nb_comments` smallint(5) unsigned DEFAULT '0',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `titre` varchar(150) NOT NULL,
  PRIMARY KEY (`idpost`),
  KEY `fk_users_idx` (`userId`),
  CONSTRAINT `fk_users` FOREIGN KEY (`userId`) REFERENCES `user` (`iduser`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (24,171,'Aux aguets ....','http://localhost:3000/images/P1000066.JPG1616098957126.jpg',10,0,'2021-03-10 16:43:36','Le chats'),(25,171,'Yorkshire à sale caractère ','http://localhost:3000/images/P1000004.JPG1616098946545.jpg',12,0,'2021-03-10 21:28:46','Ma york'),(26,171,'il est pas mignon !!','http://localhost:3000/images/P1000185.JPG1616098937024.jpg',8,0,'2021-03-12 13:11:14','Mon loulou'),(27,171,'rdtfyguhijokljlhgfdsfdftgyhuiopiuytrdsdxfcgvhjio','http://localhost:3000/images/IMG_1039.JPG1616098914434.jpg',3,0,'2021-03-14 16:25:46','tortue géante'),(28,171,'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.','http://localhost:3000/images/IMG_1017.JPG1616098867748.jpg',1,0,'2021-03-14 16:37:41','second essai'),(30,173,'Father of AngularJS, and now on to Angular.','http://localhost:3000/images/téléchargement.png1616103993161.png',2,0,'2021-03-16 12:43:27','Angular'),(31,171,'Lagon de Ranginoa ...','http://localhost:3000/images/IMG_20180919_120155.jpg1616140801131.jpg',2,0,'2021-03-16 16:11:38','vacances évasion'),(32,174,'Les desserts','http://localhost:3000/images/DSC_0211.JPG1616140331035.jpg',2,0,'2021-03-19 08:52:11','Mariage'),(33,174,'La salle','http://localhost:3000/images/Photo_02-05-2014_18_47_48.jpg1616140470699.jpg',2,0,'2021-03-19 08:54:30','Mariage'),(35,171,'gfhgjhlkjmlkmlùm\n','http://localhost:3000/images/IMG_0010.JPG1616141125323.jpg',1,0,'2021-03-19 09:05:25','Cache cache'),(45,174,'dtfyguyiop','http://localhost:3000/images/P1000212.JPG1616156202337.jpg',2,0,'2021-03-19 13:06:57','dsrdtfuytiuouuuu');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `iduser` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `photo` varchar(100) DEFAULT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `department` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` varchar(5) NOT NULL DEFAULT 'FALSE',
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (171,'http://localhost:3000/photos/b17aef300e4544c208a320f7942725af.jpg1616098999525.jpg','germain','lulu','comptabilite','dolfin26@hotmail.fr','$2b$10$NXBFe/UeR7to1qQzyOhsAOCn0eGTrE1lLrkuj5dBOiNJ3NsZZVhQO','FALSE'),(172,'http://localhost:3000/photos/P1000203.JPG1615418585204.jpg','dupont','Marie','rh','maried@gmail.com','$2b$10$VA9uqOiAr2waa6ZBF.RCU.VTK.dy4d3rDS8KulvursKcPZUPBw8rq','FALSE'),(173,'http://localhost:3000/photos/misko.jpg1616099572188.jpg','admin','komis','rh','komis@gmail.com','$2b$10$bf1VCNxF9UFpM3c/93LwF.ULVWZ1fJcSa8FOBQgzasM8EkYwBdkZ2','TRUE'),(174,'http://localhost:3000/photos/profil.jpg1616139432229.jpg','Jean','Valjean','marketing','Jean@gmail.com','$2b$10$S3u5mi2tUez6Q0mPukS4MeMfpQQGVBJajJ7e5VvA.Ptv0xVMAx8Iu','FALSE');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-19 14:28:56
