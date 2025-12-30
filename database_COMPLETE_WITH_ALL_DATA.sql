-- =====================================================
-- PIKALEADS CRM - COMPLETE DATABASE DUMP
-- =====================================================
-- Created: $(date)
-- Database: EcCrELAaL5JgQGs8z45yv6 (TiDB Cloud)
-- 
-- CONTENTS:
-- - Full database schema (50+ tables)
-- - All data (users, quizzes, leads, settings)
-- - Indexes and foreign keys
-- 
-- USERS INCLUDED:
-- 1. pikaleadswork@gmail.com (admin) - password in hash
-- 2. admin@pikaleads.com (admin) - password: admin123
-- 3. manager1@pikaleads.com (manager) - Олександр
-- 4. manager2@pikaleads.com (manager) - Артур
-- 
-- DATA INCLUDED:
-- - 16 quizzes with questions
-- - 11 leads
-- - Quiz design settings
-- - All configurations
-- =====================================================

mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: gateway02.us-east-1.prod.aws.tidbcloud.com    Database: EcCrELAaL5JgQGs8z45yv6
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.2-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1171212;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (1,'814a08e40d7fc2bcfd458759d18319198ca8ae394f2fa15617a78678e9c9c93b',1765115276246),(2,'39c5b9f535d75c60037d5a4d106f37b19d0545a2a659a09550401aec3e073eec',1765115415929),(3,'27e60301d669cfdb54680b5050eb4e564e13993b82891605f1db06e650bc2b79',1765116620903),(4,'4d88074c3c9451ec77327a618a9300e77acddaa0628e834f58e0c968286eb85d',1765117683306),(5,'ca5a5d9a1fa89675daf7b0a9f7950c64dafd3393a15b4027cfa422121d3525f2',1765118749500),(6,'cad2bba9c7d6b32993b6fe8a0a666a8f2aa7b0d8051af25c53396a15cf636498',1765118855282),(7,'32c96aac1bf6fee53f2dd684f208a54fdb2e59e058e3993a870c3b41523e782f',1765119883205),(8,'e576bb9088cfd06650e0ca509ebb26ba2b018c80d135775834d49bb068046bf6',1765120308537),(9,'52426bcfd41176c9c14e0dd9a459f5d0f447dedae6ac1e0af8495f5e5fe1e7b2',1765121160426),(10,'abc966693678efa7a9482f0df48025251e099f503366bba30c721e11ce3d29d0',1765122132808),(11,'ce12fa54b3b9eea4383854ab3e79137565f5af9b89a372d687c5d8c52509cfd3',1765123649021),(1081212,'02e873cbdb6c6ded9a508c6a6cd1a9a35cf01e7acad2d1c049ea946aca300cdb',1765190027179),(1111212,'cafb9e5217af610b1b5bcc49c1675fe6162e0e01165c0ebc4448499544e85003',1765535649963),(1111213,'cd21f072a04dcd804123da9cc27dac6a14bcd830d2599932b9497b5275a96ec9',1765536558815),(1111214,'25a34cc8f930eb972df762ddf6e5257001094be4efbb99e162dc71200726c62b',1765539104650),(1111215,'3637810dfe68ed86cb30e92f24fc73fb39fcdbc075e0ede74cd0d5be7e9e544e',1765541942209),(1111216,'2d604a203980fcf212824dd4a036c0b80118bc2f1b1c6e4f696ca8dc0318573a',1765542368322),(1111217,'6be44ff6bd3bd3116e9552c0b38d5bd9c7d0be4499d5bf82cf4c51a4488ed71c',1765548555926),(1111218,'47e671f5e8bc5c38ee4cf69a250a295053e68b6f5fb520bbd6d1ba191362ea97',1765549112798),(1111219,'76df342a708f3cd380d4070cf3f033d1a724ec5e05170ba58619afd088b0c83e',1765549912124),(1111220,'b132fd224f1d3b0fde17179e20e7288ec4409bdfc863b09acd8d049147f82fdc',1765574674811),(1111221,'bae11400bb6f71b719cad8bf5766b58b5604b7691a73310f000c939197356037',1765575894445),(1111222,'147c11468aecfb762f7413266866d763766c1443cf4217734a52c723bd06fbaf',1765577461272),(1111223,'cb68a866f7d1f1e682cc22ab6cc5d4d6e373fd29adafa5ae7da3e6862e4cc32e',1765580390102),(1111224,'41951072ee64b5d5260413c2eaaa0eb017e783bbf742da0f4c059ebdd4d3de0c',1765580962152),(1111225,'8342563113540e9547b0483e145dc7f54100ad5b4be68e26d11786cf50257ca4',1765643940665),(1111226,'c48390ed38819aadfc0d9776d8f6d3e43bf14ed38004a7ab014e93b71b7a9a46',1765654068587),(1111227,'808622043b6679ab4209941f91a12e2daf1a857c43d7a5e6beb607f7e6332777',1765656921058),(1111228,'74a090e04ab958cd1a0c2807fa26b817cc37c26f4874d5f66d29cbd767e6923d',1765658570209),(1111229,'2e68df510a5bf6909e23704d5e32de839bddf3f46278308d4e1aa458e8bc38e2',1765659459132),(1111230,'66deb5ce37142309fd27e36b11de0cf75e7eb338b4c0f9a130167b59e6f3702a',1765661117418),(1111231,'f262728205cf6462845a2f6f193e1df5764b6ded6a05b92edb8715796755798d',1765662809567),(1111232,'0b8883e8a31e82c62d81a5aeacd74740d22ced381357ed7e472f7fdf505bf6f4',1765667703740),(1111233,'deaec6b7a59372bdcf8afcd527402930aeacb89573ee67d5843882470f579060',1765707107225),(1111234,'b47488065b959a9704f217e085453de98d79fe83119eb6cfce167c546190026f',1765709404900),(1111235,'497f45f1c206acdbcf61e976712688bbc07398049389b697e73d7025b466b720',1765832795938),(1111236,'927f85d62c3967b9a074a9ffa40c39b9868610d18c46d1cc7967996f65aa1174',1765833742636),(1111237,'7c795bea5235526508ddbd96314bad376d5cc7c67ea90655475231ec0bf1859a',1765980324853),(1111238,'d2c21a82787b102807fcbe028491e7c1d1804ea4fbc9e2a82cd7e13add5778b1',1765980607582),(1111239,'f1128b1a5f1eba93746a7c771851d0be0c0fb28a8661f048a21b34bb71cfbc9b',1765981443128),(1111240,'0d81fcbf4f164eafd62c31d0542466ba7d7f1fad4ca44ac5b488a9b23cad5f7b',1765981803348),(1111241,'caaa64c94fd34a30545ff1b44bc264f52fc0adac7985cfbe79d9f102c8b141fd',1766007565348),(1111242,'e3eb6d6db1a04e8f9c9e3a8898738b60a3d3158d86f2c7984ad3fe8a016ede4a',1766009596568),(1111243,'5b636f0117952caf0ec16e9c89af7a28298ccb9e24ddef9d324155c54174acb8',1766010627418),(1111244,'abcfd30b2fa000bc4720189ea89a9d03d28bc7a43172f282bdce2be3b61619f2',1766010737998),(1111245,'30e3c13b87b73d4e1d75f22b26b9be23904728f8c152ebad5df9bf8d4fecb6d2',1766011980574),(1111246,'6e4f454ce00f4865924b8c3559fda3ec7e7d2e9c934a9fb3a44e8167d43993d2',1766012401383),(1141212,'657e2a08ac52adea594bcbb8b49958aceac4b08b9e93af533d8dd8e22e92ab19',1766509776537),(1141213,'58e094b1e90d4473512877d6f317b055e07f24d7efe5964ab80220895f1ce73c',1766524951728),(1141214,'4b81c7a19cb67061df1e01f8b2ace33b8c461498caefac558afc2eeeadf4521e',1766528602055),(1141215,'75e93cb2ba32484dfc9d4687a46ac71e06970538e4d2d73e6a4db36c29f7af04',1766581077081);
mysqldump: Couldn't execute 'ROLLBACK TO SAVEPOINT sp': SAVEPOINT sp does not exist (1305)
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

-- =====================================================
-- DATA INSERTS
-- =====================================================
mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: gateway02.us-east-1.prod.aws.tidbcloud.com    Database: EcCrELAaL5JgQGs8z45yv6
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.2-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (1,'814a08e40d7fc2bcfd458759d18319198ca8ae394f2fa15617a78678e9c9c93b',1765115276246),(2,'39c5b9f535d75c60037d5a4d106f37b19d0545a2a659a09550401aec3e073eec',1765115415929),(3,'27e60301d669cfdb54680b5050eb4e564e13993b82891605f1db06e650bc2b79',1765116620903),(4,'4d88074c3c9451ec77327a618a9300e77acddaa0628e834f58e0c968286eb85d',1765117683306),(5,'ca5a5d9a1fa89675daf7b0a9f7950c64dafd3393a15b4027cfa422121d3525f2',1765118749500),(6,'cad2bba9c7d6b32993b6fe8a0a666a8f2aa7b0d8051af25c53396a15cf636498',1765118855282),(7,'32c96aac1bf6fee53f2dd684f208a54fdb2e59e058e3993a870c3b41523e782f',1765119883205),(8,'e576bb9088cfd06650e0ca509ebb26ba2b018c80d135775834d49bb068046bf6',1765120308537),(9,'52426bcfd41176c9c14e0dd9a459f5d0f447dedae6ac1e0af8495f5e5fe1e7b2',1765121160426),(10,'abc966693678efa7a9482f0df48025251e099f503366bba30c721e11ce3d29d0',1765122132808),(11,'ce12fa54b3b9eea4383854ab3e79137565f5af9b89a372d687c5d8c52509cfd3',1765123649021),(1081212,'02e873cbdb6c6ded9a508c6a6cd1a9a35cf01e7acad2d1c049ea946aca300cdb',1765190027179),(1111212,'cafb9e5217af610b1b5bcc49c1675fe6162e0e01165c0ebc4448499544e85003',1765535649963),(1111213,'cd21f072a04dcd804123da9cc27dac6a14bcd830d2599932b9497b5275a96ec9',1765536558815),(1111214,'25a34cc8f930eb972df762ddf6e5257001094be4efbb99e162dc71200726c62b',1765539104650),(1111215,'3637810dfe68ed86cb30e92f24fc73fb39fcdbc075e0ede74cd0d5be7e9e544e',1765541942209),(1111216,'2d604a203980fcf212824dd4a036c0b80118bc2f1b1c6e4f696ca8dc0318573a',1765542368322),(1111217,'6be44ff6bd3bd3116e9552c0b38d5bd9c7d0be4499d5bf82cf4c51a4488ed71c',1765548555926),(1111218,'47e671f5e8bc5c38ee4cf69a250a295053e68b6f5fb520bbd6d1ba191362ea97',1765549112798),(1111219,'76df342a708f3cd380d4070cf3f033d1a724ec5e05170ba58619afd088b0c83e',1765549912124),(1111220,'b132fd224f1d3b0fde17179e20e7288ec4409bdfc863b09acd8d049147f82fdc',1765574674811),(1111221,'bae11400bb6f71b719cad8bf5766b58b5604b7691a73310f000c939197356037',1765575894445),(1111222,'147c11468aecfb762f7413266866d763766c1443cf4217734a52c723bd06fbaf',1765577461272),(1111223,'cb68a866f7d1f1e682cc22ab6cc5d4d6e373fd29adafa5ae7da3e6862e4cc32e',1765580390102),(1111224,'41951072ee64b5d5260413c2eaaa0eb017e783bbf742da0f4c059ebdd4d3de0c',1765580962152),(1111225,'8342563113540e9547b0483e145dc7f54100ad5b4be68e26d11786cf50257ca4',1765643940665),(1111226,'c48390ed38819aadfc0d9776d8f6d3e43bf14ed38004a7ab014e93b71b7a9a46',1765654068587),(1111227,'808622043b6679ab4209941f91a12e2daf1a857c43d7a5e6beb607f7e6332777',1765656921058),(1111228,'74a090e04ab958cd1a0c2807fa26b817cc37c26f4874d5f66d29cbd767e6923d',1765658570209),(1111229,'2e68df510a5bf6909e23704d5e32de839bddf3f46278308d4e1aa458e8bc38e2',1765659459132),(1111230,'66deb5ce37142309fd27e36b11de0cf75e7eb338b4c0f9a130167b59e6f3702a',1765661117418),(1111231,'f262728205cf6462845a2f6f193e1df5764b6ded6a05b92edb8715796755798d',1765662809567),(1111232,'0b8883e8a31e82c62d81a5aeacd74740d22ced381357ed7e472f7fdf505bf6f4',1765667703740),(1111233,'deaec6b7a59372bdcf8afcd527402930aeacb89573ee67d5843882470f579060',1765707107225),(1111234,'b47488065b959a9704f217e085453de98d79fe83119eb6cfce167c546190026f',1765709404900),(1111235,'497f45f1c206acdbcf61e976712688bbc07398049389b697e73d7025b466b720',1765832795938),(1111236,'927f85d62c3967b9a074a9ffa40c39b9868610d18c46d1cc7967996f65aa1174',1765833742636),(1111237,'7c795bea5235526508ddbd96314bad376d5cc7c67ea90655475231ec0bf1859a',1765980324853),(1111238,'d2c21a82787b102807fcbe028491e7c1d1804ea4fbc9e2a82cd7e13add5778b1',1765980607582),(1111239,'f1128b1a5f1eba93746a7c771851d0be0c0fb28a8661f048a21b34bb71cfbc9b',1765981443128),(1111240,'0d81fcbf4f164eafd62c31d0542466ba7d7f1fad4ca44ac5b488a9b23cad5f7b',1765981803348),(1111241,'caaa64c94fd34a30545ff1b44bc264f52fc0adac7985cfbe79d9f102c8b141fd',1766007565348),(1111242,'e3eb6d6db1a04e8f9c9e3a8898738b60a3d3158d86f2c7984ad3fe8a016ede4a',1766009596568),(1111243,'5b636f0117952caf0ec16e9c89af7a28298ccb9e24ddef9d324155c54174acb8',1766010627418),(1111244,'abcfd30b2fa000bc4720189ea89a9d03d28bc7a43172f282bdce2be3b61619f2',1766010737998),(1111245,'30e3c13b87b73d4e1d75f22b26b9be23904728f8c152ebad5df9bf8d4fecb6d2',1766011980574),(1111246,'6e4f454ce00f4865924b8c3559fda3ec7e7d2e9c934a9fb3a44e8167d43993d2',1766012401383),(1141212,'657e2a08ac52adea594bcbb8b49958aceac4b08b9e93af533d8dd8e22e92ab19',1766509776537),(1141213,'58e094b1e90d4473512877d6f317b055e07f24d7efe5964ab80220895f1ce73c',1766524951728),(1141214,'4b81c7a19cb67061df1e01f8b2ace33b8c461498caefac558afc2eeeadf4521e',1766528602055),(1141215,'75e93cb2ba32484dfc9d4687a46ac71e06970538e4d2d73e6a4db36c29f7af04',1766581077081);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ab_test_assignments`
--

LOCK TABLES `ab_test_assignments` WRITE;
/*!40000 ALTER TABLE `ab_test_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ab_test_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ab_test_variants`
--

LOCK TABLES `ab_test_variants` WRITE;
/*!40000 ALTER TABLE `ab_test_variants` DISABLE KEYS */;
INSERT INTO `ab_test_variants` (`id`, `quizId`, `variantName`, `isControl`, `trafficPercentage`, `isActive`, `title`, `subtitle`, `bonus`, `questions`, `createdAt`, `updatedAt`, `isWinner`, `designSettings`) VALUES (1,'ecommerce-meta','Варіант A - Тест',0,30,0,'Збільште продажі на 300% за місяць',NULL,NULL,NULL,'2025-12-16 21:36:53','2025-12-24 12:43:03',0,NULL);
/*!40000 ALTER TABLE `ab_test_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` (`id`, `userId`, `leadId`, `action`, `details`, `createdAt`) VALUES (1,1,60027,'status_change','{\"newStatusId\":2}','2025-12-15 21:01:44'),(2,1,60026,'status_change','{\"newStatusId\":3}','2025-12-15 21:01:46'),(3,1,60025,'status_change','{\"newStatusId\":4}','2025-12-15 21:01:48'),(4,2,60038,'status_change','{\"newStatusId\":2}','2025-12-17 13:34:40'),(5,2,60041,'status_change','{\"newStatusId\":2}','2025-12-17 13:35:38'),(6,1,60045,'status_change','{\"newStatusId\":3}','2025-12-17 16:53:02');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `additional_services`
--

LOCK TABLES `additional_services` WRITE;
/*!40000 ALTER TABLE `additional_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `additional_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `analytics_settings`
--

LOCK TABLES `analytics_settings` WRITE;
/*!40000 ALTER TABLE `analytics_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `assignment_history`
--

LOCK TABLES `assignment_history` WRITE;
/*!40000 ALTER TABLE `assignment_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `assignment_rules`
--

LOCK TABLES `assignment_rules` WRITE;
/*!40000 ALTER TABLE `assignment_rules` DISABLE KEYS */;
INSERT INTO `assignment_rules` (`id`, `name`, `quizName`, `managerId`, `priority`, `isActive`, `createdAt`, `updatedAt`, `type`, `conditions`, `assignmentStrategy`) VALUES (1,'Furniture Quiz Auto-Assignment','Furniture',4,10,1,'2025-12-07 15:34:04','2025-12-07 15:34:04','manual',NULL,'specific'),(2,'Apartment Renovation Quiz Auto-Assignment','Apartment Renovation',5,10,1,'2025-12-07 15:34:09','2025-12-07 15:34:09','manual',NULL,'specific');
/*!40000 ALTER TABLE `assignment_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `blog_categories`
--

LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `coverImage`, `authorId`, `categoryId`, `status`, `views`, `publishedAt`, `createdAt`, `updatedAt`) VALUES (1,'Андромеда: Новий алгоритм Meta Ads 2025','andromeda-meta-ads-2025','Meta запустила революційний алгоритм Андромеда, який змінює правила гри в таргетованій рекламі. Розбираємо ключові зміни та як адаптувати свої кампанії.','<h2>Що таке Андромеда?</h2><p>Андромеда — це новий алгоритм машинного навчання від Meta, який замінює попередню систему оптимізації реклами. Він використовує передові технології AI для кращого прогнозування конверсій.</p><h2>Ключові зміни</h2><ul><li>Автоматична оптимізація бюджету на рівні кампанії</li><li>Розширений таргетинг на основі поведінки користувачів</li><li>Швидша адаптація до змін в аудиторії</li></ul><h2>Як адаптувати кампанії?</h2><p>Щоб отримати максимум від Андромеди, рекомендуємо:</p><ol><li>Збільшити бюджет тестування на 20-30%</li><li>Дати алгоритму мінімум 7 днів на навчання</li><li>Використовувати широкий таргетинг замість вузького</li></ol>','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',1,NULL,'published',0,'2025-12-23 17:14:44','2025-12-23 17:14:44','2025-12-23 17:14:44'),(2,'Meta API: Повний гайд по інтеграції 2025','meta-api-integration-guide-2025','Детальна інструкція з інтеграції Meta Marketing API для автоматизації рекламних кампаній. Від створення додатку до першого запиту.','<h2>Навіщо потрібна Meta API?</h2><p>Meta Marketing API дозволяє автоматизувати управління рекламними кампаніями, отримувати детальну аналітику та масштабувати процеси.</p><h2>Крок 1: Створення додатку</h2><p>Перейдіть в Facebook Developers Console та створіть новий додаток типу \"Business\".</p><h2>Крок 2: Налаштування доступу</h2><p>Отримайте Access Token з правами ads_management та ads_read.</p><h2>Приклад запиту</h2><pre><code>curl -X GET \"https://graph.facebook.com/v18.0/act_123456789/campaigns\" -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"</code></pre>','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',1,NULL,'published',0,'2025-12-23 17:14:44','2025-12-23 17:14:44','2025-12-23 17:14:44'),(3,'Google Analytics 4: Налаштування для e-commerce','google-analytics-4-ecommerce-setup','GA4 кардинально відрізняється від Universal Analytics. Покрокова інструкція з налаштування відстеження для інтернет-магазинів.','<h2>Чому GA4?</h2><p>Google Analytics 4 — це майбутнє веб-аналітики. Universal Analytics припинив роботу в 2023 році, тому міграція на GA4 обов\'язкова.</p><h2>Налаштування e-commerce подій</h2><p>GA4 використовує event-based модель замість pageview. Основні події для e-commerce:</p><ul><li>view_item — перегляд товару</li><li>add_to_cart — додавання в кошик</li><li>begin_checkout — початок оформлення</li><li>purchase — покупка</li></ul><h2>Інтеграція з GTM</h2><p>Використовуйте Google Tag Manager для спрощення налаштування. Створіть Data Layer змінні для передачі даних про товари.</p>','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',1,NULL,'published',0,'2025-12-23 17:14:44','2025-12-23 17:14:44','2025-12-23 17:14:44'),(4,'TikTok Ads: Як отримати CPM $2 в Україні','tiktok-ads-low-cpm-ukraine','TikTok Ads в Україні все ще недооцінений канал. Ділимося стратегією, як отримати CPM $2 та залучити якісну аудиторію.','<h2>Чому TikTok Ads?</h2><p>TikTok має найнижчий CPM серед всіх соціальних мереж в Україні. При правильному підході можна отримати CPM $1.5-$3.</p><h2>Секрети низького CPM</h2><ol><li><strong>Креативи в стилі UGC</strong> — знімайте на телефон, без монтажу</li><li><strong>Перші 3 секунди</strong> — зачіпка має бути миттєвою</li><li><strong>Таргетинг на інтереси</strong> — уникайте lookalike на старті</li></ol><h2>Структура кампанії</h2><p>Створіть 3-5 креативів, запустіть з бюджетом $10/день на кожен. Через 3 дні вимкніть неефективні та масштабуйте переможців.</p>','https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',1,NULL,'published',1,'2025-12-23 17:14:44','2025-12-23 17:14:44','2025-12-23 17:21:48');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `blog_seo`
--

LOCK TABLES `blog_seo` WRITE;
/*!40000 ALTER TABLE `blog_seo` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_seo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `call_logs`
--

LOCK TABLES `call_logs` WRITE;
/*!40000 ALTER TABLE `call_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `call_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `case_studies`
--

LOCK TABLES `case_studies` WRITE;
/*!40000 ALTER TABLE `case_studies` DISABLE KEYS */;
INSERT INTO `case_studies` (`id`, `title`, `slug`, `client`, `industry`, `description`, `content`, `coverImage`, `images`, `results`, `tags`, `isPublished`, `publishedAt`, `viewCount`, `orderIndex`, `createdBy`, `createdAt`, `updatedAt`) VALUES (1,'Збільшення продажів меблів на 350% через Meta Ads','furniture-meta-ads-350-increase','Меблева фабрика \'Comfort Home\'','Меблі та інтер\'єр','Як ми допомогли меблевій компанії збільшити онлайн-продажі на 350% за 3 місяці використовуючи таргетовану рекламу в Facebook та Instagram.','\n<h2>Про клієнта</h2>\n<p>Меблева фабрика \'Comfort Home\' - виробник якісних меблів з 15-річним досвідом. До початку співпраці компанія мала проблеми з онлайн-продажами та залежала виключно від офлайн-каналів.</p>\n\n<h2>Виклик</h2>\n<ul>\n  <li>Низька впізнаваність бренду в онлайні</li>\n  <li>Відсутність системного підходу до digital-маркетингу</li>\n  <li>Високий CPL (вартість ліда) - $15-20</li>\n  <li>Низька конверсія сайту - 0.8%</li>\n</ul>\n\n<h2>Рішення</h2>\n<p>Ми розробили комплексну стратегію, яка включала:</p>\n<ul>\n  <li><strong>Створення квізу для підбору меблів</strong> - інтерактивний інструмент, який допомагає клієнтам обрати ідеальні меблі</li>\n  <li><strong>Сегментація аудиторії</strong> - 12 різних сегментів за інтересами та поведінкою</li>\n  <li><strong>Динамічні креативи</strong> - автоматична генерація оголошень під кожен сегмент</li>\n  <li><strong>Ретаргетинг</strong> - багаторівнева воронка повернення клієнтів</li>\n</ul>\n\n<h2>Результати</h2>\n<div style=\"background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n  <div style=\"display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\">\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">+350%</div>\n      <div style=\"color: #9ca3af;\">Зростання продажів</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">$4.2</div>\n      <div style=\"color: #9ca3af;\">CPL (було $18)</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">6.8x</div>\n      <div style=\"color: #9ca3af;\">ROAS</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">1,247</div>\n      <div style=\"color: #9ca3af;\">Лідів за 3 місяці</div>\n    </div>\n  </div>\n</div>\n\n<h2>Ключові інсайти</h2>\n<p>Використання квізу збільшило конверсію на 280% порівняно зі звичайними лендінгами. Клієнти, які проходили квіз, мали на 45% вищий середній чек.</p>\n','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',NULL,'{\"roi\":\"350%\",\"leads\":\"1,247\",\"roas\":\"6.8x\",\"cpl\":\"$4.2\"}','[\"Meta Ads\",\"Меблі\",\"Квіз\",\"E-commerce\"]',1,'2025-12-23 21:28:47',0,1,1,'2025-12-23 21:28:47','2025-12-23 21:28:47'),(2,'ROAS 8.5x для інтернет-магазину одягу через Google Ads','fashion-google-ads-roas-85x','Fashion Boutique \'Style Avenue\'','Мода та одяг','Як ми досягли ROAS 8.5x для інтернет-магазину жіночого одягу використовуючи Google Shopping та Performance Max кампанії.','\n<h2>Про клієнта</h2>\n<p>Style Avenue - інтернет-магазин жіночого одягу преміум-сегменту з асортиментом 500+ позицій. Компанія працювала з Google Ads, але результати були нестабільними.</p>\n\n<h2>Виклик</h2>\n<ul>\n  <li>Нестабільний ROAS - коливання від 2x до 4x</li>\n  <li>Висока вартість конверсії - $45</li>\n  <li>Низька ефективність Shopping кампаній</li>\n  <li>Відсутність аналітики та відстеження</li>\n</ul>\n\n<h2>Рішення</h2>\n<p>Ми впровадили:</p>\n<ul>\n  <li><strong>Performance Max кампанії</strong> з динамічними фідами</li>\n  <li><strong>Розширене відстеження</strong> - GA4 + серверний GTM</li>\n  <li><strong>Сегментація продуктів</strong> - 8 груп за маржинальністю та попитом</li>\n  <li><strong>Автоматизація ставок</strong> - Smart Bidding з урахуванням LTV</li>\n  <li><strong>Ретаргетинг</strong> - персоналізовані оголошення на основі переглянутих товарів</li>\n</ul>\n\n<h2>Результати</h2>\n<div style=\"background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n  <div style=\"display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\">\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">8.5x</div>\n      <div style=\"color: #9ca3af;\">ROAS</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">$18</div>\n      <div style=\"color: #9ca3af;\">Вартість конверсії</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">+420%</div>\n      <div style=\"color: #9ca3af;\">Зростання доходу</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">2,850</div>\n      <div style=\"color: #9ca3af;\">Замовлень</div>\n    </div>\n  </div>\n</div>\n\n<h2>Ключові інсайти</h2>\n<p>Performance Max показав на 65% кращі результати порівняно зі стандартними Shopping кампаніями. Впровадження серверного GTM покращило точність відстеження на 35%.</p>\n','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',NULL,'{\"roi\":\"420%\",\"leads\":\"2,850\",\"roas\":\"8.5x\",\"cpl\":\"$18\"}','[\"Google Ads\",\"E-commerce\",\"Performance Max\",\"Fashion\"]',1,'2025-12-23 21:28:47',6,2,1,'2025-12-23 21:28:47','2025-12-23 22:48:24'),(3,'Генерація 3,500+ лідів для ремонтної компанії через TikTok Ads','renovation-tiktok-ads-3500-leads','Ремонтна компанія \'Perfect Renovation\'','Ремонт та будівництво','Як ми згенерували 3,500+ якісних лідів для ремонтної компанії використовуючи TikTok Ads та інтерактивні квізи.','\n<h2>Про клієнта</h2>\n<p>Perfect Renovation - компанія з ремонту квартир та будинків, яка працює в Києві та області. До співпраці компанія використовувала лише Facebook Ads з середніми результатами.</p>\n\n<h2>Виклик</h2>\n<ul>\n  <li>Насичення аудиторії в Facebook</li>\n  <li>Високий CPL - $12-15</li>\n  <li>Низька якість лідів - конверсія в угоди 8%</li>\n  <li>Потреба в нових каналах залучення</li>\n</ul>\n\n<h2>Рішення</h2>\n<p>Ми запустили TikTok Ads з фокусом на:</p>\n<ul>\n  <li><strong>Відео-контент</strong> - 20+ креативів з прикладами робіт</li>\n  <li><strong>Квіз для розрахунку вартості</strong> - інтерактивний калькулятор ремонту</li>\n  <li><strong>Таргетинг на власників нерухомості</strong> - 25-45 років</li>\n  <li><strong>Spark Ads</strong> - використання органічного контенту в рекламі</li>\n  <li><strong>Ретаргетинг</strong> - повернення незавершених квізів</li>\n</ul>\n\n<h2>Результати</h2>\n<div style=\"background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n  <div style=\"display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\">\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">3,547</div>\n      <div style=\"color: #9ca3af;\">Лідів за 4 місяці</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">$2.8</div>\n      <div style=\"color: #9ca3af;\">CPL</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">18%</div>\n      <div style=\"color: #9ca3af;\">Конверсія в угоди</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">5.2x</div>\n      <div style=\"color: #9ca3af;\">ROAS</div>\n    </div>\n  </div>\n</div>\n\n<h2>Ключові інсайти</h2>\n<p>TikTok показав на 75% нижчий CPL порівняно з Facebook. Квіз збільшив якість лідів - конверсія в угоди зросла з 8% до 18%. Spark Ads показали на 40% кращі результати за звичайні оголошення.</p>\n','https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',NULL,'{\"roi\":\"420%\",\"leads\":\"3,547\",\"roas\":\"5.2x\",\"cpl\":\"$2.8\"}','[\"TikTok Ads\",\"Ремонт\",\"Квіз\",\"Lead Generation\"]',1,'2025-12-23 21:28:47',0,3,1,'2025-12-23 21:28:47','2025-12-23 21:28:47'),(4,'ROI 580% для B2B SaaS компанії через LinkedIn Ads','b2b-saas-linkedin-ads-roi-580','SaaS платформа \'BusinessHub\'','B2B SaaS','Як ми досягли ROI 580% для B2B SaaS компанії використовуючи LinkedIn Ads та ABM (Account-Based Marketing) стратегію.','\n<h2>Про клієнта</h2>\n<p>BusinessHub - SaaS платформа для управління бізнес-процесами малого та середнього бізнесу. Середній чек - $2,500/рік. Компанія шукала ефективні канали для залучення B2B клієнтів.</p>\n\n<h2>Виклик</h2>\n<ul>\n  <li>Висока вартість ліда в B2B - $150-200</li>\n  <li>Довгий цикл угоди - 3-6 місяців</li>\n  <li>Складність таргетингу на decision makers</li>\n  <li>Низька конверсія з ліда в клієнта - 5%</li>\n</ul>\n\n<h2>Рішення</h2>\n<p>Ми впровадили ABM стратегію:</p>\n<ul>\n  <li><strong>LinkedIn Ads</strong> з таргетингом на CEO, CFO, COO</li>\n  <li><strong>Lead Gen Forms</strong> - нативні форми LinkedIn</li>\n  <li><strong>Контент-маркетинг</strong> - whitepaper, кейси, вебінари</li>\n  <li><strong>Ретаргетинг</strong> - багаторівнева воронка прогріву</li>\n  <li><strong>Інтеграція з CRM</strong> - автоматизація lead nurturing</li>\n</ul>\n\n<h2>Результати</h2>\n<div style=\"background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n  <div style=\"display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\">\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">580%</div>\n      <div style=\"color: #9ca3af;\">ROI</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">$85</div>\n      <div style=\"color: #9ca3af;\">CPL</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">18%</div>\n      <div style=\"color: #9ca3af;\">Конверсія в клієнти</div>\n    </div>\n    <div>\n      <div style=\"color: #fbbf24; font-size: 32px; font-weight: bold;\">247</div>\n      <div style=\"color: #9ca3af;\">Якісних лідів</div>\n    </div>\n  </div>\n</div>\n\n<h2>Ключові інсайти</h2>\n<p>LinkedIn Lead Gen Forms показали на 60% вищу конверсію порівняно з лендінгами. Контент-маркетинг скоротив цикл угоди з 4.5 до 2.8 місяців. ABM підхід збільшив конверсію з ліда в клієнта з 5% до 18%.</p>\n','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',NULL,'{\"roi\":\"580%\",\"leads\":\"247\",\"roas\":\"6.8x\",\"cpl\":\"$85\"}','[\"LinkedIn Ads\",\"B2B\",\"SaaS\",\"ABM\"]',1,'2025-12-23 21:28:47',0,4,1,'2025-12-23 21:28:47','2025-12-23 21:28:47');
/*!40000 ALTER TABLE `case_studies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `error_logs`
--

LOCK TABLES `error_logs` WRITE;
/*!40000 ALTER TABLE `error_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `error_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_notifications`
--

LOCK TABLES `event_notifications` WRITE;
/*!40000 ALTER TABLE `event_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events_log`
--

LOCK TABLES `events_log` WRITE;
/*!40000 ALTER TABLE `events_log` DISABLE KEYS */;
INSERT INTO `events_log` (`id`, `event_type`, `platform`, `status`, `event_data`, `error_message`, `user_id`, `quiz_id`, `timestamp`, `response_time`, `ip_address`, `user_agent`, `clarity_user_id`, `clarity_session_id`, `clarity_project_id`) VALUES (1,'quiz_start','clarity','success','{\"quizId\": \"test-quiz\", \"quizName\": \"Test Quiz\"}',NULL,'test-session-123','test-quiz','2025-12-17 22:56:53',150,NULL,NULL,NULL,NULL,NULL),(2,'form_submit','ga4','fail','{\"formType\": \"lead_form\"}','Network timeout','test-session-456',NULL,'2025-12-17 22:56:53',5000,NULL,NULL,NULL,NULL,NULL),(3,'cta_click','gtm','success','{\"buttonText\": \"Learn More\", \"location\": \"home_quiz_furniture\"}',NULL,'test-session-789',NULL,'2025-12-17 22:56:53',100,NULL,NULL,NULL,NULL,NULL),(4,'quiz_complete','meta_pixel','success','{\"quizId\": \"furniture-quiz\", \"totalQuestions\": 5}',NULL,'test-session-meta','furniture-quiz','2025-12-17 22:56:53',200,NULL,NULL,NULL,NULL,NULL),(5,'quiz_question_answer','clarity','success','{\"answerText\": \"Option A\", \"questionIndex\": 3, \"quizId\": \"test-quiz\", \"timestamp\": \"2025-12-17T22:56:53.612Z\", \"totalQuestions\": 5}',NULL,'test-session-data-integrity',NULL,'2025-12-17 22:56:53',NULL,NULL,NULL,NULL,NULL,NULL),(6,'page_view','ga4','success',NULL,NULL,NULL,NULL,'2025-12-17 22:56:53',NULL,NULL,NULL,NULL,NULL,NULL),(7,'quiz_start','clarity','success','{\"quizId\": \"test-quiz\"}',NULL,'test-session-123',NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,'test_user_456','test_session_789','test_project_123'),(8,'page_view','ga4','success','{\"page\": \"/home\"}',NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,NULL,NULL,NULL),(9,'cta_click','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,NULL,NULL,'partial_project'),(10,'form_submit','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),(11,'quiz_complete','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,'user@456#test','sess$789%test','proj-123_test'),(12,'test_event_1','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,'test_user_456','test_session_789','test_project_123'),(13,'test_event_2','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,NULL,NULL,NULL),(14,'test_event_3','ga4','success',NULL,NULL,NULL,NULL,'2025-12-17 23:02:42',NULL,NULL,NULL,NULL,NULL,NULL),(15,'quiz_start','clarity','success','{\"quizId\": \"test-quiz\"}',NULL,'test-session-123',NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,'test_user_456','test_session_789','test_project_123'),(16,'page_view','ga4','success','{\"page\": \"/home\"}',NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,NULL,NULL,NULL),(17,'cta_click','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,NULL,NULL,'partial_project'),(18,'form_submit','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),(19,'quiz_complete','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,'user@456#test','sess$789%test','proj-123_test'),(20,'test_event_1','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,'test_user_456','test_session_789','test_project_123'),(21,'test_event_2','clarity','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,NULL,NULL,NULL),(22,'test_event_3','ga4','success',NULL,NULL,NULL,NULL,'2025-12-17 23:03:17',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `events_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `filterPresets`
--

LOCK TABLES `filterPresets` WRITE;
/*!40000 ALTER TABLE `filterPresets` DISABLE KEYS */;
INSERT INTO `filterPresets` (`id`, `userId`, `name`, `filters`, `isDefault`, `createdAt`, `updatedAt`) VALUES (1,1,'Test Campaign Leads','{\"campaign\":\"test_campaign\"}',0,'2025-12-12 21:36:38','2025-12-12 21:36:38');
/*!40000 ALTER TABLE `filterPresets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inbound_messages`
--

LOCK TABLES `inbound_messages` WRITE;
/*!40000 ALTER TABLE `inbound_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `inbound_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `incomplete_quiz_sessions`
--

LOCK TABLES `incomplete_quiz_sessions` WRITE;
/*!40000 ALTER TABLE `incomplete_quiz_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `incomplete_quiz_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `integration_settings`
--

LOCK TABLES `integration_settings` WRITE;
/*!40000 ALTER TABLE `integration_settings` DISABLE KEYS */;
INSERT INTO `integration_settings` (`id`, `provider`, `credentials`, `isActive`, `createdAt`, `updatedAt`) VALUES (1,'telegram','{\"botToken\": \"8109110065:AAFMykyIO2DWzkWj_OKP_OYAZlpH6H39enw\", \"chatId\": \"-1003393497944\"}',1,'2025-12-15 19:49:08','2025-12-15 19:49:08');
/*!40000 ALTER TABLE `integration_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `interaction_history`
--

LOCK TABLES `interaction_history` WRITE;
/*!40000 ALTER TABLE `interaction_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `interaction_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lead_activities`
--

LOCK TABLES `lead_activities` WRITE;
/*!40000 ALTER TABLE `lead_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lead_comments`
--

LOCK TABLES `lead_comments` WRITE;
/*!40000 ALTER TABLE `lead_comments` DISABLE KEYS */;
INSERT INTO `lead_comments` (`id`, `leadId`, `userId`, `comment`, `createdAt`) VALUES (1,60037,1,'Test comment from admin','2025-12-17 13:34:40'),(2,60037,2,'Test comment from manager','2025-12-17 13:34:40'),(3,60038,2,'Manager comment test','2025-12-17 13:34:40'),(4,60042,1,'Test comment from admin','2025-12-17 13:35:38'),(5,60042,2,'Test comment from manager','2025-12-17 13:35:38'),(6,60041,2,'Manager comment test','2025-12-17 13:35:38'),(7,60041,1,'Тестовий коментар для перевірки швидкого доступу до коментарів з таблиці CRM','2025-12-17 14:38:20');
/*!40000 ALTER TABLE `lead_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lead_history`
--

LOCK TABLES `lead_history` WRITE;
/*!40000 ALTER TABLE `lead_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lead_statuses`
--

LOCK TABLES `lead_statuses` WRITE;
/*!40000 ALTER TABLE `lead_statuses` DISABLE KEYS */;
INSERT INTO `lead_statuses` (`id`, `name`, `color`, `order`, `isDefault`, `createdBy`, `createdAt`, `updatedAt`) VALUES (1,'New','#3B82F6',1,1,1,'2025-12-07 15:01:29','2025-12-07 15:01:29'),(2,'In Progress','#F59E0B',2,0,1,'2025-12-07 15:01:29','2025-12-07 15:01:29'),(3,'Contacted','#8B5CF6',3,0,1,'2025-12-07 15:01:29','2025-12-07 15:01:29'),(4,'Qualified','#10B981',4,0,1,'2025-12-07 15:01:29','2025-12-07 15:01:29'),(5,'Closed Won','#22C55E',5,0,1,'2025-12-07 15:01:29','2025-12-07 15:01:29'),(6,'Closed Lost','#EF4444',6,0,1,'2025-12-07 15:01:29','2025-12-07 15:01:29');
/*!40000 ALTER TABLE `lead_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` (`id`, `quizName`, `answers`, `name`, `phone`, `telegram`, `createdAt`, `language`, `statusId`, `assignedTo`, `email`, `utmCampaign`, `utmAdGroup`, `utmAd`, `utmPlacement`, `utmKeyword`, `utmSite`, `utmSource`, `utmMedium`, `utmContent`, `utmTerm`, `leadScore`, `source`, `spentAmount`, `timeOnSite`, `fbp`, `fbc`, `clientIp`, `userAgent`, `ga4ClientId`, `eventId`) VALUES (90001,'Консультація','[]','Test User','+380501234567',NULL,'2025-12-23 15:27:36',NULL,1,NULL,'test@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90002,'Стратегія','[]','Strategy Test','+380507654321',NULL,'2025-12-23 15:27:36',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Стратегія',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90003,'Консультація','[]','Minimal User','+380991112233',NULL,'2025-12-23 15:27:36',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90004,'Консультація','[]','','+380991112233',NULL,'2025-12-23 15:27:36',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90005,'Консультація','[]','Test User','',NULL,'2025-12-23 15:27:37',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90006,'Консультація','[]','Test User','+380501234567',NULL,'2025-12-23 15:28:01',NULL,1,NULL,'test@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90007,'Стратегія','[]','Strategy Test','+380507654321',NULL,'2025-12-23 15:28:01',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Стратегія',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90008,'Консультація','[]','Minimal User','+380991112233',NULL,'2025-12-23 15:28:01',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90009,'Консультація','[]','Test User','+380501234567',NULL,'2025-12-23 15:42:04',NULL,1,NULL,'test@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90010,'Стратегія','[]','Strategy Test','+380507654321',NULL,'2025-12-23 15:42:04',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Стратегія',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL),(90011,'Консультація','[]','Minimal User','+380991112233',NULL,'2025-12-23 15:42:05',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Консультація',NULL,NULL,NULL,50,NULL,0.00,0,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `manager_invitations`
--

LOCK TABLES `manager_invitations` WRITE;
/*!40000 ALTER TABLE `manager_invitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `manager_invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `performance_metrics`
--

LOCK TABLES `performance_metrics` WRITE;
/*!40000 ALTER TABLE `performance_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `performance_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `question_templates`
--

LOCK TABLES `question_templates` WRITE;
/*!40000 ALTER TABLE `question_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_answer_options`
--

LOCK TABLES `quiz_answer_options` WRITE;
/*!40000 ALTER TABLE `quiz_answer_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_answer_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_design_settings`
--

LOCK TABLES `quiz_design_settings` WRITE;
/*!40000 ALTER TABLE `quiz_design_settings` DISABLE KEYS */;
INSERT INTO `quiz_design_settings` (`id`, `quizId`, `layoutType`, `backgroundImage`, `logoImage`, `primaryColor`, `accentColor`, `fontFamily`, `titleText`, `subtitleText`, `buttonText`, `bonusText`, `createdAt`, `updatedAt`, `backgroundVideo`, `alignment`, `bonusEnabled`, `companyName`, `phoneNumber`, `contactFormTitle`, `contactFormSubtitle`, `contactFormFields`, `thankYouTitle`, `thankYouSubtitle`, `thankYouButtonText`, `thankYouButtonUrl`, `backgroundGradient`, `titleWeight`, `titleFontSize`, `subtitleWeight`, `subtitleFontSize`, `buttonRadiusPx`, `bullets`, `titleColor`, `subtitleColor`) VALUES (53,11,'standard','https://pika-leads.com/quiz-images/ecommerce-bg.png','','#5B2E90','#FFD93D','Inter','{\"uk\":\"Реклама для магазину працює а продажів мало?\",\"ru\":\"Реклама для магазина работает а продаж мало?\",\"en\":\"Ads working but sales are low?\"}','{\"uk\":\"Отримайте безкоштовний аудит, який знайде 99% помилок, що починають зливати бюджет\",\"ru\":\"Получите бесплатный аудит, который найдет 99% ошибок, начинающих сливать бюджет\",\"en\":\"Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення\",\"pl\":\"Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення\",\"de\":\"Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення\"}','Розпочати квіз','','2025-12-24 17:08:48','2025-12-24 21:30:58','','left',0,'PikaLeads','+380992377117','{\"uk\":\"Залиште свої контакти\",\"ru\":\"Оставьте свои контакты\",\"en\":\"Leave your contacts\",\"pl\":\"Zostaw swoje kontakty\",\"de\":\"Hinterlassen Sie Ihre Kontakte\"}','{\"uk\":\"Ми зв\'яжемося з вами найближчим часом\",\"ru\":\"Мы свяжемся с вами в ближайшее время\",\"en\":\"We will contact you shortly\",\"pl\":\"Skontaktujemy się z Tobą wkrótce\",\"de\":\"Wir werden uns in Kürze bei Ihnen melden\"}','[\"name\", \"phone\", \"email\"]','{\"uk\":\"Дякуємо за вашу заявку!\",\"ru\":\"Спасибо за вашу заявку!\",\"en\":\"Thank you for your application!\",\"pl\":\"Dziękujemy za zgłoszenie!\",\"de\":\"Vielen Dank für Ihre Bewerbung!\"}','{\"uk\":\"Наш менеджер зв\'яжеться з вами найближчим часом\",\"ru\":\"Наш менеджер свяжется с вами в ближайшее время\",\"en\":\"Our manager will contact you shortly\",\"pl\":\"Nasz menedżer skontaktuje się z Tobą wkrótce\",\"de\":\"Unser Manager wird sich in Kürze bei Ihnen melden\"}','{\"uk\":\"На головну\",\"ru\":\"На главную\",\"en\":\"To main page\",\"pl\":\"Na stronę główną\",\"de\":\"Zur Hauptseite\"}','/',NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(54,12,'standard','https://pika-leads.com/quiz-images/ecommerce-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для інтернет-магазину — не трафік, а продажі','Налаштовуємо Search і Shopping рекламу з контролем окупності та реального результату','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(55,13,'standard','https://pika-leads.com/quiz-images/renovation-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Ремонт без заявок — значить реклама налаштована криво','Беремо Meta рекламу для ремонту квартир під контроль: заявки, стабільність, масштаб','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(56,14,'standard','https://pika-leads.com/quiz-images/renovation-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для ремонту квартир — заявки з пошуку','Налаштовуємо Google рекламу для ремонтних компаній з фокусом на реальних клієнтів','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(57,15,'standard','https://pika-leads.com/quiz-images/furniture-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Меблева реклама без заявок — проблема не в ринку','Запускаємо Meta Ads для меблевих компаній з фокусом на заявки','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(58,16,'standard','https://pika-leads.com/quiz-images/furniture-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для меблів — клієнти з пошуку','Беремо під контроль пошукову рекламу для меблевого бізнесу','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(59,17,'standard','https://pika-leads.com/quiz-images/telegram-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Telegram без результату — реклама ллється не туди','Запускаємо Meta рекламу для Telegram-проєктів з фокусом на живу аудиторію','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(60,18,'standard','https://pika-leads.com/quiz-images/telegram-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для Telegram — трафік з наміром','Налаштовуємо пошукову рекламу під Telegram-воронки','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(61,19,'standard','https://pika-leads.com/quiz-images/construction-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Будівництво без заявок — реклама працює на конкурентів','Запускаємо Meta рекламу для будівельних компаній з фокусом на якісні заявки','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(62,20,'standard','https://pika-leads.com/quiz-images/construction-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для будівництва — клієнти з пошуку','Налаштовуємо Google рекламу для будівельних компаній з фокусом на реальних замовників','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(63,21,'standard','https://pika-leads.com/quiz-images/food-delivery-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Доставка їжі без замовлень — таргет не працює','Запускаємо Meta рекламу для доставки їжі з фокусом на замовлення та повторні покупки','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(64,22,'standard','https://pika-leads.com/quiz-images/food-delivery-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для доставки їжі — замовлення з пошуку','Налаштовуємо Google рекламу для доставки їжі з фокусом на конверсії','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(65,23,'standard','https://pika-leads.com/quiz-images/b2b-bg.png',NULL,'#5B2E90','#FFD93D','Inter','B2B реклама без якісних заявок — злитий бюджет','Запускаємо Meta Ads для B2B з фокусом на ЛПР і угоди','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(66,24,'standard','https://pika-leads.com/quiz-images/b2b-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads для B2B — заявки від бізнесу','Беремо під контроль Google рекламу для B2B-компаній','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(67,25,'standard','https://pika-leads.com/quiz-images/general-bg.png','','#5B2E90','#FFD93D','Inter','{\"uk\":\"Отримайте від 20 заявок на день\",\"ru\":\"Получайте от 20 заявок в день\",\"en\":\"Реклама без результату — проблема в налаштуванні\",\"pl\":\"Реклама без результату — проблема в налаштуванні\",\"de\":\"Реклама без результату — проблема в налаштуванні\"}','{\"uk\":\"Швидкий запуск реклами за 3 дні з гарантією рузельтату, який прописується в договорі\",\"ru\":\"Быстрый запуск или перезапуск рекламы за 3 дня с гарантией результата\",\"en\":\"Запускаємо Meta рекламу для вашого бізнесу з фокусом на реальний результат\",\"pl\":\"Запускаємо Meta рекламу для вашого бізнесу з фокусом на реальний результат\",\"de\":\"Запускаємо Meta рекламу для вашого бізнесу з фокусом на реальний результат\"}','Дізнатись більше','','2025-12-24 17:08:48','2025-12-24 17:08:48','','left',0,'PikaLeads','+380992377117','{\"uk\":\"Залиште свої контакти\",\"ru\":\"Оставьте свои контакты\",\"en\":\"Leave your contacts\",\"pl\":\"Zostaw swoje kontakty\",\"de\":\"Hinterlassen Sie Ihre Kontakte\"}','{\"uk\":\"Ми зв\'яжемося з вами найближчим часом\",\"ru\":\"Мы свяжемся с вами в ближайшее время\",\"en\":\"We will contact you shortly\",\"pl\":\"Skontaktujemy się z Tobą wkrótce\",\"de\":\"Wir werden uns in Kürze bei Ihnen melden\"}','[\"name\",\"phone\",\"email\",\"telegram\"]','{\"uk\":\"Дякуємо за вашу заявку!\",\"ru\":\"Спасибо за вашу заявку!\",\"en\":\"Thank you for your application!\",\"pl\":\"Dziękujemy za zgłoszenie!\",\"de\":\"Vielen Dank für Ihre Bewerbung!\"}','{\"uk\":\"Наш менеджер зв\'яжеться з вами найближчим часом\",\"ru\":\"Наш менеджер свяжется с вами в ближайшее время\",\"en\":\"Our manager will contact you shortly\",\"pl\":\"Nasz menedżer skontaktuje się z Tobą wkrótce\",\"de\":\"Unser Manager wird sich in Kürze bei Ihnen melden\"}','{\"uk\":\"На головну\",\"ru\":\"На главную\",\"en\":\"To main page\",\"pl\":\"Na stronę główną\",\"de\":\"Zur Hauptseite\"}','/',NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF'),(68,26,'standard','https://pika-leads.com/quiz-images/general-bg.png',NULL,'#5B2E90','#FFD93D','Inter','Google Ads без результату — налаштуємо правильно','Беремо під контроль Google рекламу для вашого бізнесу','Розпочати квіз',NULL,'2025-12-24 17:08:48','2025-12-24 17:08:48',NULL,'left',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'bold',48,'normal',20,25,NULL,'#FFFFFF','#FFFFFF');
/*!40000 ALTER TABLE `quiz_design_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_question_events`
--

LOCK TABLES `quiz_question_events` WRITE;
/*!40000 ALTER TABLE `quiz_question_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_question_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
INSERT INTO `quiz_questions` (`id`, `quizId`, `questionText`, `questionType`, `orderIndex`, `isRequired`, `settings`, `createdAt`, `updatedAt`, `answerOptions`) VALUES (11,11,'{\"uk\":\"Що зараз не працює в рекламі?\",\"ru\":\"Что сейчас не работает в рекламе?\",\"en\":\"What doesn\'t work in advertising now?\",\"pl\":\"Co teraz nie działa w reklamie?\",\"de\":\"Was funktioniert in der Werbung nicht mehr?\"}','text_options',0,1,NULL,'2025-12-15 19:32:22','2025-12-15 19:32:22','[{\"uk\":\"Продажів мало\",\"ru\":\"Продаж мало.\",\"en\":\"There are few sales\",\"pl\":\"Sprzedaż jest niewielka\",\"de\":\"Es gibt nur wenige Verkäufe\"},{\"uk\":\"Продажі нестабільні\",\"ru\":\"Продажи нестабильны\",\"en\":\"Sales are unstable\",\"pl\":\"Sprzedaż jest niestabilna\",\"de\":\"Die Verkäufe sind unbeständig\"},{\"uk\":\"Бюджет зливається\",\"ru\":\"Бюджет сливается\",\"en\":\"The budget is merging\",\"pl\":\"Budżet się łączy\",\"de\":\"Der Haushalt wird zusammengelegt\"},{\"uk\":\"Результату немає\",\"ru\":\"Никакого результата.\",\"en\":\"No result\",\"pl\":\"Brak wyniku\",\"de\":\"Kein Ergebnis\"}]'),(12,11,'{\"uk\":\"Чи була реклама в Meta?\",\"ru\":\"Была ли реклама в Meta?\",\"en\":\"Was there any advertising in Meta?\",\"pl\":\"Czy w Meta były jakieś reklamy?\",\"de\":\"Gab es Werbung in Meta?\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(13,11,'{\"uk\":\"Формат продажів:\",\"ru\":\"Формат продаж:\",\"en\":\"Sales format:\",\"pl\":\"Format sprzedaży:\",\"de\":\"Verkaufsformat:\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Власний сайт\",\"ru\":\"Собственный сайт\",\"en\":\"Own website\",\"pl\":\"Własna strona internetowa\",\"de\":\"Eigene Website\"},{\"uk\":\"Каталог / соцмережі\",\"ru\":\"Каталог / соцсети\",\"en\":\"Catalog / social networks\",\"pl\":\"Katalog / sieci społecznościowe\",\"de\":\"Katalog / Soziale Netzwerke\"},{\"uk\":\"Маркетплейс\",\"ru\":\"Маркетплейс\",\"en\":\"Marketplace\",\"pl\":\"Rynek\",\"de\":\"Marktplatz\"}]'),(14,11,'{\"uk\":\"Основна ціль:\",\"ru\":\"Основная цель:\",\"en\":\"Main objective:\",\"pl\":\"Główny cel:\",\"de\":\"Hauptziel:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"Масштаб\",\"ru\":\"Масштаб\",\"en\":\"Scale\",\"pl\":\"Skala\",\"de\":\"Skala\"},{\"uk\":\"Стабільність\",\"ru\":\"Стабильность\",\"en\":\"Stability\",\"pl\":\"Stabilność\",\"de\":\"Stabilität\"}]'),(15,12,'{\"uk\":\"Яка головна проблема зараз?\",\"ru\":\"Какая главная проблема сейчас?\",\"en\":\"What is the main problem now?\",\"pl\":\"Jaki jest teraz główny problem?\",\"de\":\"Was ist nun das Hauptproblem?\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає продажів\",\"ru\":\"Нет продаж\",\"en\":\"No sales\",\"pl\":\"Brak sprzedaży\",\"de\":\"Keine Verkäufe\"},{\"uk\":\"Низька окупність\",\"ru\":\"Низкая окупаемость\",\"en\":\"Low payback period\",\"pl\":\"Niski okres zwrotu z inwestycji\",\"de\":\"Niedrige Amortisationszeit\"},{\"uk\":\"Дорогі заявки\",\"ru\":\"Дорогие заявки\",\"en\":\"Expensive applications\",\"pl\":\"Drogie aplikacje\",\"de\":\"Teure Anwendungen\"}]'),(16,12,'{\"uk\":\"Які кампанії запускались?\",\"ru\":\"Какие кампании запускались?\",\"en\":\"What campaigns were launched?\",\"pl\":\"Jakie kampanie zostały uruchomione?\",\"de\":\"Welche Kampagnen haben Sie gestartet?\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Search\",\"ru\":\"Поиск\",\"en\":\"Search\",\"pl\":\"Wyszukiwanie\",\"de\":\"Suche\"},{\"uk\":\"Shopping\",\"ru\":\"шоппинг\",\"en\":\"Shopping\",\"pl\":\"Zakupy\",\"de\":\"Einkaufen\"},{\"uk\":\"Performance Max\",\"ru\":\"Максимальная производительность\",\"en\":\"Performance Max\",\"pl\":\"Performance Max\",\"de\":\"Leistung Max\"},{\"uk\":\"Не запускались\",\"ru\":\"Не запускались\",\"en\":\"Not launched\",\"pl\":\"Nie uruchomiono\",\"de\":\"Hat nicht begonnen\"}]'),(17,12,'{\"uk\":\"Чи є аналітика продажів?\",\"ru\":\"Есть ли аналитика продаж?\",\"en\":\"Do you have sales analytics?\",\"pl\":\"Czy masz analitykę sprzedaży?\",\"de\":\"Verfügen Sie über Verkaufsanalysen?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(18,12,'{\"uk\":\"Ключова ціль:\",\"ru\":\"Ключевая цель:\",\"en\":\"Key objective:\",\"pl\":\"Kluczowy cel:\",\"de\":\"Hauptziel:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"ROAS\",\"ru\":\"ROAS\",\"en\":\"ROAS\",\"pl\":\"ROAS\",\"de\":\"ROAS\"},{\"uk\":\"Масштаб\",\"ru\":\"Масштаб\",\"en\":\"Scale\",\"pl\":\"Skala\",\"de\":\"Skala\"}]'),(19,13,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало заявок\",\"ru\":\"Мало заявок\",\"en\":\"Few applications\",\"pl\":\"Niewiele zastosowań\",\"de\":\"Wenige Anwendungen\"},{\"uk\":\"Неякісні заявки\",\"ru\":\"Некачественные заявки\",\"en\":\"Low-quality applications\",\"pl\":\"Aplikacje niskiej jakości\",\"de\":\"Qualitativ minderwertige Anwendungen\"},{\"uk\":\"Дорога реклама\",\"ru\":\"Дорогая реклама\",\"en\":\"Expensive advertising\",\"pl\":\"Drogie reklamy\",\"de\":\"Teure Werbung\"}]'),(20,13,'{\"uk\":\"Місто роботи:\",\"ru\":\"Город работы:\",\"en\":\"City of work:\",\"pl\":\"Miasto pracy:\",\"de\":\"Stadt der Arbeit:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(21,13,'{\"uk\":\"Чи була реклама в Meta?\",\"ru\":\"Была ли реклама в Meta?\",\"en\":\"Was there any advertising in Meta?\",\"pl\":\"Czy w Meta były jakieś reklamy?\",\"de\":\"Gab es Werbung in Meta?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(22,13,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Більше заявок\",\"ru\":\"Больше заявок\",\"en\":\"More applications\",\"pl\":\"Więcej aplikacji\",\"de\":\"Weitere Anwendungen\"},{\"uk\":\"Стабільний потік\",\"ru\":\"Стабильный поток\",\"en\":\"Stable flow\",\"pl\":\"Stabilny przepływ\",\"de\":\"Stabile Strömung\"}]'),(23,14,'{\"uk\":\"Основна проблема з Google Ads:\",\"ru\":\"Основная проблема с Google Ads:\",\"en\":\"The main problem with Google Ads:\",\"pl\":\"Główny problem z Google Ads:\",\"de\":\"Das Hauptproblem bei Google Ads:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає заявок\",\"ru\":\"Нет заявок\",\"en\":\"No applications\",\"pl\":\"Brak aplikacji\",\"de\":\"Keine Anträge\"},{\"uk\":\"Дорогі кліки\",\"ru\":\"Дорогие клики\",\"en\":\"Expensive clicks\",\"pl\":\"Drogie kliknięcia\",\"de\":\"Teure Klicks\"},{\"uk\":\"Низька конверсія\",\"ru\":\"Низкая конверсия\",\"en\":\"Low conversion rate\",\"pl\":\"Niski współczynnik konwersji\",\"de\":\"Niedrige Konversionsrate\"}]'),(24,14,'{\"uk\":\"Які послуги рекламуєте?\",\"ru\":\"Какие услуги рекламируете?\",\"en\":\"What services do you advertise?\",\"pl\":\"Jakie usługi reklamujesz?\",\"de\":\"Für welche Dienstleistungen werben Sie?\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(25,14,'{\"uk\":\"Чи є сайт?\",\"ru\":\"Есть ли сайт?\",\"en\":\"Do you have a website?\",\"pl\":\"Czy masz stronę internetową?\",\"de\":\"Haben Sie eine Website?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(26,14,'{\"uk\":\"Чи ведеться облік заявок?\",\"ru\":\"Ведется ли учет заявок?\",\"en\":\"Is there a record of applications?\",\"pl\":\"Czy istnieje rejestr zgłoszeń?\",\"de\":\"Gibt es ein Verzeichnis der Anträge?\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(27,15,'{\"uk\":\"Що не працює?\",\"ru\":\"Что не работает?\",\"en\":\"What doesn\'t work?\",\"pl\":\"Co nie działa?\",\"de\":\"Was funktioniert nicht?\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало заявок\",\"ru\":\"Мало заявок\",\"en\":\"Few applications\",\"pl\":\"Niewiele zastosowań\",\"de\":\"Wenige Anwendungen\"},{\"uk\":\"Дорогі заявки\",\"ru\":\"Дорогие заявки\",\"en\":\"Expensive applications\",\"pl\":\"Drogie aplikacje\",\"de\":\"Teure Anwendungen\"},{\"uk\":\"Немає продажів\",\"ru\":\"Нет продаж\",\"en\":\"No sales\",\"pl\":\"Brak sprzedaży\",\"de\":\"Keine Verkäufe\"}]'),(28,15,'{\"uk\":\"Тип меблів:\",\"ru\":\"Тип мебели:\",\"en\":\"Type of furniture:\",\"pl\":\"Rodzaj mebli:\",\"de\":\"Art der Möbel:\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Корпусні меблі\",\"ru\":\"Корпусная мебель\",\"en\":\"Cabinet furniture\",\"pl\":\"Meble gabinetowe\",\"de\":\"Kabinettmöbel\"},{\"uk\":\"М\'яка частина\",\"ru\":\"Мягкая часть\",\"en\":\"Soft part\",\"pl\":\"Część miękka\",\"de\":\"Weicher Teil\"},{\"uk\":\"Кухні\",\"ru\":\"Кухни\",\"en\":\"Kitchens\",\"pl\":\"Kuchnie\",\"de\":\"Küchen\"},{\"uk\":\"Офісні меблі\",\"ru\":\"Офисная мебель\",\"en\":\"Office furniture\",\"pl\":\"Meble biurowe\",\"de\":\"Büromöbel\"},{\"uk\":\"Інше\",\"ru\":\"Другое\",\"en\":\"Other\",\"pl\":\"Inne\",\"de\":\"Andere\"}]'),(29,15,'{\"uk\":\"Чи була реклама?\",\"ru\":\"Была ли реклама?\",\"en\":\"Was there any advertising?\",\"pl\":\"Czy były jakieś reklamy?\",\"de\":\"Gab es Werbung?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(30,15,'{\"uk\":\"Потрібний результат:\",\"ru\":\"Нужный результат:\",\"en\":\"We need a result:\",\"pl\":\"Potrzebujemy wyniku:\",\"de\":\"Wir brauchen ein Ergebnis:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Більше заявок\",\"ru\":\"Больше заявок\",\"en\":\"More applications\",\"pl\":\"Więcej aplikacji\",\"de\":\"Weitere Anwendungen\"},{\"uk\":\"Якісніші заявки\",\"ru\":\"Более качественные заявки\",\"en\":\"Higher quality applications\",\"pl\":\"Wyższa jakość aplikacji\",\"de\":\"Hochwertige Anwendungen\"},{\"uk\":\"Масштабування\",\"ru\":\"Масштабирование\",\"en\":\"Scaling\",\"pl\":\"Skalowanie\",\"de\":\"Skalierung\"}]'),(31,16,'{\"uk\":\"Проблема з Google Ads:\",\"ru\":\"Проблема с Google Ads:\",\"en\":\"The problem with Google Ads:\",\"pl\":\"Problem z reklamami Google:\",\"de\":\"Das Problem mit Google Ads:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає заявок\",\"ru\":\"Нет заявок\",\"en\":\"No applications\",\"pl\":\"Brak aplikacji\",\"de\":\"Keine Anträge\"},{\"uk\":\"Дорогі кліки\",\"ru\":\"Дорогие клики\",\"en\":\"Expensive clicks\",\"pl\":\"Drogie kliknięcia\",\"de\":\"Teure Klicks\"},{\"uk\":\"Низька конверсія\",\"ru\":\"Низкая конверсия\",\"en\":\"Low conversion rate\",\"pl\":\"Niski współczynnik konwersji\",\"de\":\"Niedrige Konversionsrate\"}]'),(32,16,'{\"uk\":\"Основні запити:\",\"ru\":\"Основные запросы:\",\"en\":\"Main requests:\",\"pl\":\"Główne żądania:\",\"de\":\"Die wichtigsten Anfragen:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(33,16,'{\"uk\":\"Чи є сайт?\",\"ru\":\"Есть ли сайт?\",\"en\":\"Do you have a website?\",\"pl\":\"Czy masz stronę internetową?\",\"de\":\"Haben Sie eine Website?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(34,16,'{\"uk\":\"Аналітика:\",\"ru\":\"Аналитика:\",\"en\":\"Analytics:\",\"pl\":\"Analityka:\",\"de\":\"Analytik:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Налаштована\",\"ru\":\"Настроена\",\"en\":\"Customized\",\"pl\":\"Konfiguracja\",\"de\":\"Einrichten\"},{\"uk\":\"Не налаштована\",\"ru\":\"Не настроена\",\"en\":\"Not configured\",\"pl\":\"Nie skonfigurowano\",\"de\":\"Nicht konfiguriert\"}]'),(35,17,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало підписників\",\"ru\":\"Мало подписчиков\",\"en\":\"Few subscribers\",\"pl\":\"Niewielu subskrybentów\",\"de\":\"Wenige Abonnenten\"},{\"uk\":\"Дорогий підписник\",\"ru\":\"Дорогой подписчик\",\"en\":\"Dear subscriber\",\"pl\":\"Drogi subskrybencie\",\"de\":\"Lieber Abonnent\"},{\"uk\":\"Неактивна аудиторія\",\"ru\":\"Неактивная аудитория\",\"en\":\"Inactive audience\",\"pl\":\"Nieaktywna publiczność\",\"de\":\"Inaktives Publikum\"}]'),(36,17,'{\"uk\":\"Тематика каналу:\",\"ru\":\"Тематика канала:\",\"en\":\"Channel topics:\",\"pl\":\"Tematy kanałów:\",\"de\":\"Kanal-Themen:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(37,17,'{\"uk\":\"Чи була реклама?\",\"ru\":\"Была ли реклама?\",\"en\":\"Was there any advertising?\",\"pl\":\"Czy były jakieś reklamy?\",\"de\":\"Gab es Werbung?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(38,17,'{\"uk\":\"Ціль каналу:\",\"ru\":\"Цель канала:\",\"en\":\"The purpose of the channel:\",\"pl\":\"Cel kanału:\",\"de\":\"Der Zweck des Kanals:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"Монетизація\",\"ru\":\"Монетизация\",\"en\":\"Monetization\",\"pl\":\"Monetyzacja\",\"de\":\"Monetarisierung\"},{\"uk\":\"Охоплення\",\"ru\":\"Охват\",\"en\":\"Coverage.\",\"pl\":\"Pokrycie.\",\"de\":\"Deckung.\"}]'),(39,18,'{\"uk\":\"Гео:\",\"ru\":\"Гео:\",\"en\":\"Geo:\",\"pl\":\"Geo:\",\"de\":\"Geo:\"}','custom_input',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(40,18,'{\"uk\":\"Проблема:\",\"ru\":\"Проблема:\",\"en\":\"Problem:\",\"pl\":\"Problem:\",\"de\":\"Problem:\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало трафіку\",\"ru\":\"Мало трафика\",\"en\":\"Little traffic\",\"pl\":\"Mały ruch\",\"de\":\"Wenig Verkehr\"},{\"uk\":\"Дорогий клік\",\"ru\":\"Дорогой клик\",\"en\":\"Expensive click\",\"pl\":\"Drogie kliknięcie\",\"de\":\"Teurer Klick\"},{\"uk\":\"Низька конверсія\",\"ru\":\"Низкая конверсия\",\"en\":\"Low conversion rate\",\"pl\":\"Niski współczynnik konwersji\",\"de\":\"Niedrige Konversionsrate\"}]'),(41,18,'{\"uk\":\"Чи є лендинг?\",\"ru\":\"Есть ли лендинг?\",\"en\":\"Is there a landing page?\",\"pl\":\"Czy istnieje strona docelowa?\",\"de\":\"Gibt es eine Landing Page?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(42,18,'{\"uk\":\"Ціль реклами:\",\"ru\":\"Цель рекламы:\",\"en\":\"The purpose of advertising:\",\"pl\":\"Cel reklamy:\",\"de\":\"Der Zweck der Werbung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Підписники\",\"ru\":\"Подписчики\",\"en\":\"Subscribers\",\"pl\":\"Subskrybenci\",\"de\":\"Abonnenten\"},{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"Реєстрації\",\"ru\":\"Регистрации\",\"en\":\"Registrations\",\"pl\":\"Rejestracje\",\"de\":\"Anmeldungen\"}]'),(43,19,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало заявок\",\"ru\":\"Мало заявок\",\"en\":\"Few applications\",\"pl\":\"Niewiele zastosowań\",\"de\":\"Wenige Anwendungen\"},{\"uk\":\"Неякісні заявки\",\"ru\":\"Некачественные заявки\",\"en\":\"Low-quality applications\",\"pl\":\"Aplikacje niskiej jakości\",\"de\":\"Qualitativ minderwertige Anwendungen\"},{\"uk\":\"Дорога реклама\",\"ru\":\"Дорогая реклама\",\"en\":\"Expensive advertising\",\"pl\":\"Kosztowna reklama\",\"de\":\"Teure Werbung\"}]'),(44,19,'{\"uk\":\"Тип послуг:\",\"ru\":\"Тип услуг:\",\"en\":\"Type of service:\",\"pl\":\"Rodzaj usługi:\",\"de\":\"Art der Dienstleistung:\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Будівництво будинків\",\"ru\":\"Строительство домов\",\"en\":\"Construction of houses\",\"pl\":\"Konstrukcja budynku\",\"de\":\"Bauwesen\"},{\"uk\":\"Комерційне будівництво\",\"ru\":\"Коммерческое строительство\",\"en\":\"Commercial construction\",\"pl\":\"Budownictwo komercyjne\",\"de\":\"Gewerblicher Bau\"},{\"uk\":\"Ремонт\",\"ru\":\"Ремонт\",\"en\":\"Repair\",\"pl\":\"Naprawa\",\"de\":\"Reparatur\"},{\"uk\":\"Інше\",\"ru\":\"Другое\",\"en\":\"Other\",\"pl\":\"Inne\",\"de\":\"Andere\"}]'),(45,19,'{\"uk\":\"Чи була реклама в Meta?\",\"ru\":\"Была ли реклама в Meta?\",\"en\":\"Was there any advertising in Meta?\",\"pl\":\"Czy w Meta były jakieś reklamy?\",\"de\":\"Gab es Werbung in Meta?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(46,19,'{\"uk\":\"Бажаний результат:\",\"ru\":\"Желаемый результат:\",\"en\":\"The desired result:\",\"pl\":\"Pożądany rezultat:\",\"de\":\"Das gewünschte Ergebnis:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Більше заявок\",\"ru\":\"Больше заявок\",\"en\":\"More applications\",\"pl\":\"Więcej aplikacji\",\"de\":\"Weitere Anwendungen\"},{\"uk\":\"Якісніші ліди\",\"ru\":\"Более качественные лиды\",\"en\":\"Higher quality leads\",\"pl\":\"Wyższa jakość potencjalnych klientów\",\"de\":\"Höhere Qualität der Leads\"},{\"uk\":\"Стабільний потік\",\"ru\":\"Стабильный поток\",\"en\":\"Stable flow\",\"pl\":\"Stabilny przepływ\",\"de\":\"Stabiler Fluss\"}]'),(47,20,'{\"uk\":\"Проблема з Google Ads:\",\"ru\":\"Проблема с Google Ads:\",\"en\":\"The problem with Google Ads:\",\"pl\":\"Problem z reklamami Google:\",\"de\":\"Das Problem mit Google Ads:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає заявок\",\"ru\":\"Нет заявок\",\"en\":\"No applications\",\"pl\":\"Brak aplikacji\",\"de\":\"Keine Anträge\"},{\"uk\":\"Дорогі кліки\",\"ru\":\"Дорогие клики\",\"en\":\"Expensive clicks\",\"pl\":\"Drogie kliknięcia\",\"de\":\"Teure Klicks\"},{\"uk\":\"Нецільовий трафік\",\"ru\":\"Нецелевой трафик\",\"en\":\"Non-targeted traffic\",\"pl\":\"Ruch nieukierunkowany\",\"de\":\"Nicht zielgerichteter Verkehr\"}]'),(48,20,'{\"uk\":\"Регіон роботи:\",\"ru\":\"Регион работы:\",\"en\":\"Region of work:\",\"pl\":\"Region pracy:\",\"de\":\"Region der Arbeit:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(49,20,'{\"uk\":\"Чи є сайт?\",\"ru\":\"Есть ли сайт?\",\"en\":\"Do you have a website?\",\"pl\":\"Czy masz stronę internetową?\",\"de\":\"Haben Sie eine Website?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(50,20,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Заявки\",\"ru\":\"Заявки\",\"en\":\"Applications\",\"pl\":\"Zastosowania\",\"de\":\"Anwendungen\"},{\"uk\":\"Дзвінки\",\"ru\":\"Звонки\",\"en\":\"Calls\",\"pl\":\"Połączenia\",\"de\":\"Anrufe\"},{\"uk\":\"Консультації\",\"ru\":\"Консультации\",\"en\":\"Consultations\",\"pl\":\"Konsultacje\",\"de\":\"Konsultationen\"}]'),(51,21,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало замовлень\",\"ru\":\"Мало заказов\",\"en\":\"Few orders\",\"pl\":\"Niewiele zamówień\",\"de\":\"Wenige Aufträge\"},{\"uk\":\"Дорогі замовлення\",\"ru\":\"Дорогие заказы\",\"en\":\"Expensive orders\",\"pl\":\"Drogie zamówienia\",\"de\":\"Teure Aufträge\"},{\"uk\":\"Немає повторних\",\"ru\":\"Нет повторных\",\"en\":\"There are no repeated\",\"pl\":\"Nie ma powtórzeń\",\"de\":\"Es gibt keine Wiederholungen\"}]'),(52,21,'{\"uk\":\"Тип кухні:\",\"ru\":\"Тип кухни:\",\"en\":\"Type of kitchen:\",\"pl\":\"Rodzaj kuchni:\",\"de\":\"Art der Küche:\"}','text_options',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Піца\",\"ru\":\"Пицца\",\"en\":\"Pizza\",\"pl\":\"Pizza\",\"de\":\"Pizza\"},{\"uk\":\"Суші\",\"ru\":\"Суши\",\"en\":\"Sushi\",\"pl\":\"Sushi\",\"de\":\"Sushi\"},{\"uk\":\"Бургери\",\"ru\":\"Бургеры\",\"en\":\"Burgers\",\"pl\":\"Burgery\",\"de\":\"Burger\"},{\"uk\":\"Здорове харчування\",\"ru\":\"Здоровое питание\",\"en\":\"Healthy nutrition\",\"pl\":\"Zdrowe odżywianie\",\"de\":\"Gesunde Ernährung\"},{\"uk\":\"Інше\",\"ru\":\"Другое\",\"en\":\"Other\",\"pl\":\"Inne\",\"de\":\"Andere\"}]'),(53,21,'{\"uk\":\"Чи була реклама?\",\"ru\":\"Была ли реклама?\",\"en\":\"Was there any advertising?\",\"pl\":\"Czy były jakieś reklamy?\",\"de\":\"Gab es Werbung?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(54,21,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Нові клієнти\",\"ru\":\"Новые клиенты\",\"en\":\"New clients\",\"pl\":\"Nowi klienci\",\"de\":\"Neue Kunden\"},{\"uk\":\"Повторні замовлення\",\"ru\":\"Повторные заказы\",\"en\":\"Repeat orders\",\"pl\":\"Powtarzające się zamówienia\",\"de\":\"Wiederholte Bestellungen\"},{\"uk\":\"Масштаб\",\"ru\":\"Масштаб\",\"en\":\"Scale\",\"pl\":\"Skala\",\"de\":\"Skala\"}]'),(55,22,'{\"uk\":\"Проблема:\",\"ru\":\"Проблема:\",\"en\":\"Problem:\",\"pl\":\"Problem:\",\"de\":\"Problem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало замовлень\",\"ru\":\"Мало заказов\",\"en\":\"Few orders\",\"pl\":\"Niewiele zamówień\",\"de\":\"Wenige Aufträge\"},{\"uk\":\"Дорогий клік\",\"ru\":\"Дорогой клик\",\"en\":\"Expensive click\",\"pl\":\"Drogie kliknięcie\",\"de\":\"Teurer Klick\"},{\"uk\":\"Низька конверсія\",\"ru\":\"Низкая конверсия\",\"en\":\"Low conversion rate\",\"pl\":\"Niski współczynnik konwersji\",\"de\":\"Niedrige Konversionsrate\"}]'),(56,22,'{\"uk\":\"Місто доставки:\",\"ru\":\"Город доставки:\",\"en\":\"Delivery city:\",\"pl\":\"Miasto dostawy:\",\"de\":\"Ort der Lieferung:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(57,22,'{\"uk\":\"Чи є сайт/додаток?\",\"ru\":\"Есть ли сайт/приложение?\",\"en\":\"Do you have a website/application?\",\"pl\":\"Czy masz stronę internetową/aplikację?\",\"de\":\"Haben Sie eine Website/Anwendung?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Сайт\",\"ru\":\"Сайт\",\"en\":\"Website.\",\"pl\":\"Strona internetowa.\",\"de\":\"Website.\"},{\"uk\":\"Додаток\",\"ru\":\"Приложение\",\"en\":\"Application.\",\"pl\":\"Dodatek.\",\"de\":\"Anhang.\"},{\"uk\":\"Обидва\",\"ru\":\"Оба\",\"en\":\"Both\",\"pl\":\"Oba\",\"de\":\"Beide\"},{\"uk\":\"Немає\",\"ru\":\"Нет\",\"en\":\"No\",\"pl\":\"Nie\",\"de\":\"Nein\"}]'),(58,22,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Замовлення\",\"ru\":\"Заказ\",\"en\":\"Order.\",\"pl\":\"Zamówienie\",\"de\":\"Bestellung\"},{\"uk\":\"Встановлення додатку\",\"ru\":\"Установка приложения\",\"en\":\"Installing the application\",\"pl\":\"Instalowanie aplikacji\",\"de\":\"Installation der Anwendung\"},{\"uk\":\"Обидва\",\"ru\":\"Оба\",\"en\":\"Both\",\"pl\":\"Oba\",\"de\":\"Beide\"}]'),(59,23,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало заявок\",\"ru\":\"Мало заявок\",\"en\":\"Few applications\",\"pl\":\"Niewiele zastosowań\",\"de\":\"Wenige Anwendungen\"},{\"uk\":\"Неякісні ліди\",\"ru\":\"Некачественные лиды\",\"en\":\"Low-quality leads\",\"pl\":\"Niskiej jakości leady\",\"de\":\"Qualitativ minderwertige Leads\"},{\"uk\":\"Довгий цикл угоди\",\"ru\":\"Долгий цикл сделки\",\"en\":\"Long transaction cycle\",\"pl\":\"Długi cykl transakcji\",\"de\":\"Langer Transaktionszyklus\"}]'),(60,23,'{\"uk\":\"Сфера бізнесу:\",\"ru\":\"Сфера бизнеса:\",\"en\":\"Business area:\",\"pl\":\"Obszar działalności:\",\"de\":\"Geschäftsfeld:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(61,23,'{\"uk\":\"Чи була реклама в Meta?\",\"ru\":\"Была ли реклама в Meta?\",\"en\":\"Was there any advertising in Meta?\",\"pl\":\"Czy w Meta były jakieś reklamy?\",\"de\":\"Gab es Werbung in Meta?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(62,23,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Заявки від ЛПР\",\"ru\":\"Заявки от ЛПР\",\"en\":\"Applications from the LPR\",\"pl\":\"Wnioski LPR\",\"de\":\"Anträge der LPR\"},{\"uk\":\"Демо-дзвінки\",\"ru\":\"Демо-звонки\",\"en\":\"Demo calls\",\"pl\":\"Połączenia demonstracyjne\",\"de\":\"Demo-Aufrufe\"},{\"uk\":\"Угоди\",\"ru\":\"Соглашения\",\"en\":\"Agreements\",\"pl\":\"Umowy\",\"de\":\"Vereinbarungen\"}]'),(63,24,'{\"uk\":\"Проблема:\",\"ru\":\"Проблема:\",\"en\":\"Problem:\",\"pl\":\"Problem:\",\"de\":\"Problem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає заявок\",\"ru\":\"Нет заявок\",\"en\":\"No applications\",\"pl\":\"Brak aplikacji\",\"de\":\"Keine Anträge\"},{\"uk\":\"Неякісні ліди\",\"ru\":\"Некачественные лиды\",\"en\":\"Low-quality leads\",\"pl\":\"Niskiej jakości leady\",\"de\":\"Qualitativ minderwertige Leads\"},{\"uk\":\"Дорогі кліки\",\"ru\":\"Дорогие клики\",\"en\":\"Expensive clicks\",\"pl\":\"Drogie kliknięcia\",\"de\":\"Teure Klicks\"}]'),(64,24,'{\"uk\":\"Продукт/послуга:\",\"ru\":\"Продукт/услуга:\",\"en\":\"Product/service:\",\"pl\":\"Produkt/usługa:\",\"de\":\"Produkt/Dienstleistung:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(65,24,'{\"uk\":\"Чи є сайт?\",\"ru\":\"Есть ли сайт?\",\"en\":\"Do you have a website?\",\"pl\":\"Czy masz stronę internetową?\",\"de\":\"Haben Sie eine Website?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(66,24,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Заявки\",\"ru\":\"Заявки\",\"en\":\"Applications\",\"pl\":\"Zastosowania\",\"de\":\"Anwendungen\"},{\"uk\":\"Дзвінки\",\"ru\":\"Звонки\",\"en\":\"Calls\",\"pl\":\"Połączenia\",\"de\":\"Anrufe\"},{\"uk\":\"Демо\",\"ru\":\"Демо\",\"en\":\"Demo\",\"pl\":\"Demo\",\"de\":\"Demo\"}]'),(67,25,'{\"uk\":\"Основна проблема:\",\"ru\":\"Основная проблема:\",\"en\":\"The main problem:\",\"pl\":\"Główny problem:\",\"de\":\"Das Hauptproblem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Мало заявок\",\"ru\":\"Мало заявок\",\"en\":\"Few applications\",\"pl\":\"Niewiele zastosowań\",\"de\":\"Wenige Anwendungen\"},{\"uk\":\"Дорогі заявки\",\"ru\":\"Дорогие заявки\",\"en\":\"Expensive applications\",\"pl\":\"Drogie aplikacje\",\"de\":\"Teure Anwendungen\"},{\"uk\":\"Немає продажів\",\"ru\":\"Нет продаж\",\"en\":\"No sales\",\"pl\":\"Brak sprzedaży\",\"de\":\"Keine Verkäufe\"},{\"uk\":\"Нестабільний результат\",\"ru\":\"Нестабильный результат\",\"en\":\"Unstable result\",\"pl\":\"Niestabilne wyniki\",\"de\":\"Unbeständige Ergebnisse\"}]'),(68,25,'{\"uk\":\"Ваша ніша:\",\"ru\":\"Ваша ниша:\",\"en\":\"Your niche:\",\"pl\":\"Twoja nisza:\",\"de\":\"Ihre Nische:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(69,25,'{\"uk\":\"Чи була реклама в Meta?\",\"ru\":\"Была ли реклама в Meta?\",\"en\":\"Was there any advertising in Meta?\",\"pl\":\"Czy w Meta były jakieś reklamy?\",\"de\":\"Gab es Werbung in Meta?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(70,25,'{\"uk\":\"Бажаний результат:\",\"ru\":\"Желаемый результат:\",\"en\":\"The desired result:\",\"pl\":\"Pożądany rezultat:\",\"de\":\"Das gewünschte Ergebnis:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Заявки\",\"ru\":\"Заявки\",\"en\":\"Applications\",\"pl\":\"Zastosowania\",\"de\":\"Anwendungen\"},{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"Підписники\",\"ru\":\"Подписчики\",\"en\":\"Subscribers\",\"pl\":\"Subskrybenci\",\"de\":\"Abonnenten\"},{\"uk\":\"Охоплення\",\"ru\":\"Охват\",\"en\":\"Coverage.\",\"pl\":\"Pokrycie.\",\"de\":\"Deckung.\"}]'),(71,26,'{\"uk\":\"Проблема:\",\"ru\":\"Проблема:\",\"en\":\"Problem:\",\"pl\":\"Problem:\",\"de\":\"Problem:\"}','text_options',0,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Немає заявок\",\"ru\":\"Нет заявок\",\"en\":\"No applications\",\"pl\":\"Brak aplikacji\",\"de\":\"Keine Anträge\"},{\"uk\":\"Дорогі кліки\",\"ru\":\"Дорогие клики\",\"en\":\"Expensive clicks\",\"pl\":\"Drogie kliknięcia\",\"de\":\"Teure Klicks\"},{\"uk\":\"Низька конверсія\",\"ru\":\"Низкая конверсия\",\"en\":\"Low conversion rate\",\"pl\":\"Niski współczynnik konwersji\",\"de\":\"Niedrige Konversionsrate\"},{\"uk\":\"Нецільовий трафік\",\"ru\":\"Нецелевой трафик\",\"en\":\"Non-targeted traffic\",\"pl\":\"Ruch nieukierunkowany\",\"de\":\"Nicht zielgerichteter Verkehr\"}]'),(72,26,'{\"uk\":\"Ваша ніша:\",\"ru\":\"Ваша ниша:\",\"en\":\"Your niche:\",\"pl\":\"Twoja nisza:\",\"de\":\"Ihre Nische:\"}','custom_input',1,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23',NULL),(73,26,'{\"uk\":\"Чи є сайт?\",\"ru\":\"Есть ли сайт?\",\"en\":\"Do you have a website?\",\"pl\":\"Czy masz stronę internetową?\",\"de\":\"Haben Sie eine Website?\"}','text_options',2,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Так\",\"ru\":\"Да.\",\"en\":\"Yes.\",\"pl\":\"Tak\",\"de\":\"Ja\"},{\"uk\":\"Ні\",\"ru\":\"Нет.\",\"en\":\"No.\",\"pl\":\"Nie.\",\"de\":\"Nein.\"}]'),(74,26,'{\"uk\":\"Ціль:\",\"ru\":\"Цель:\",\"en\":\"Objective:\",\"pl\":\"Cel:\",\"de\":\"Zielsetzung:\"}','text_options',3,1,NULL,'2025-12-15 19:32:23','2025-12-15 19:32:23','[{\"uk\":\"Заявки\",\"ru\":\"Заявки\",\"en\":\"Applications\",\"pl\":\"Zastosowania\",\"de\":\"Anwendungen\"},{\"uk\":\"Продажі\",\"ru\":\"Продажи\",\"en\":\"Sales\",\"pl\":\"Sprzedaż\",\"de\":\"Vertrieb\"},{\"uk\":\"Дзвінки\",\"ru\":\"Звонки\",\"en\":\"Calls\",\"pl\":\"Połączenia\",\"de\":\"Anrufe\"},{\"uk\":\"Трафік\",\"ru\":\"Трафик\",\"en\":\"Traffic\",\"pl\":\"Ruch drogowy\",\"de\":\"Verkehr\"}]');
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_sessions`
--

LOCK TABLES `quiz_sessions` WRITE;
/*!40000 ALTER TABLE `quiz_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_templates`
--

LOCK TABLES `quiz_templates` WRITE;
/*!40000 ALTER TABLE `quiz_templates` DISABLE KEYS */;
INSERT INTO `quiz_templates` (`id`, `name`, `niche`, `description`, `previewImage`, `quizData`, `designPreset`, `isActive`, `usageCount`, `createdAt`, `updatedAt`) VALUES (1,'Меблі для вітальні - Класичний стиль','furniture','Допоможіть клієнтам підібрати ідеальні меблі для вітальні в класичному стилі','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800','{\"questions\":[{\"id\":1,\"text\":\"Який розмір вашої вітальні?\",\"type\":\"single\",\"options\":[\"До 15 м²\",\"15-25 м²\",\"25-40 м²\",\"Більше 40 м²\"]},{\"id\":2,\"text\":\"Який стиль вам подобається?\",\"type\":\"single\",\"options\":[\"Класичний\",\"Сучасний\",\"Скандинавський\",\"Лофт\"]},{\"id\":3,\"text\":\"Який ваш бюджет?\",\"type\":\"single\",\"options\":[\"До 50 000 грн\",\"50 000 - 100 000 грн\",\"100 000 - 200 000 грн\",\"Більше 200 000 грн\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#8B4513\",\"accentColor\":\"#D2691E\",\"fontFamily\":\"Playfair Display\",\"titleText\":\"Підберіть ідеальні меблі для вашої вітальні\",\"subtitleText\":\"Пройдіть тест за 2 хвилини та отримайте персональну підбірку меблів\",\"buttonText\":\"Почати підбір\",\"bonusText\":\"Знижка 15% на першу покупку\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(2,'Меблі для спальні - Мінімалізм','furniture','Квіз для підбору меблів у спальню в стилі мінімалізм','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800','{\"questions\":[{\"id\":1,\"text\":\"Скільки людей буде спати в спальні?\",\"type\":\"single\",\"options\":[\"1 особа\",\"2 особи\",\"2+ дітей\"]},{\"id\":2,\"text\":\"Потрібна система зберігання?\",\"type\":\"multiple\",\"options\":[\"Шафа\",\"Комод\",\"Тумбочки\",\"Не потрібно\"]},{\"id\":3,\"text\":\"Ваш бюджет на спальню?\",\"type\":\"single\",\"options\":[\"До 40 000 грн\",\"40 000 - 80 000 грн\",\"80 000 - 150 000 грн\",\"Більше 150 000 грн\"]}]}','{\"layoutType\":\"background\",\"primaryColor\":\"#E8E8E8\",\"accentColor\":\"#333333\",\"fontFamily\":\"Inter\",\"titleText\":\"Створіть ідеальну спальню\",\"subtitleText\":\"Мінімалізм, комфорт та функціональність\",\"buttonText\":\"Розпочати\",\"bonusText\":\"Безкоштовна доставка та збірка\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(3,'Кухонні меблі - Сучасний дизайн','furniture','Підбір кухонних меблів під індивідуальні потреби','https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800','{\"questions\":[{\"id\":1,\"text\":\"Тип кухні?\",\"type\":\"single\",\"options\":[\"Лінійна\",\"Кутова\",\"П-подібна\",\"Острівна\"]},{\"id\":2,\"text\":\"Розмір кухні?\",\"type\":\"single\",\"options\":[\"До 6 м²\",\"6-10 м²\",\"10-15 м²\",\"Більше 15 м²\"]},{\"id\":3,\"text\":\"Матеріал фасадів?\",\"type\":\"single\",\"options\":[\"МДФ\",\"Масив дерева\",\"Пластик\",\"Скло\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#FF6B35\",\"accentColor\":\"#004E89\",\"fontFamily\":\"Montserrat\",\"titleText\":\"Кухня вашої мрії\",\"subtitleText\":\"Індивідуальний дизайн та якісні матеріали\",\"buttonText\":\"Підібрати кухню\",\"bonusText\":\"3D візуалізація безкоштовно\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(4,'Ремонт квартири - Під ключ','renovation','Розрахунок вартості ремонту квартири під ключ','https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800','{\"questions\":[{\"id\":1,\"text\":\"Площа квартири?\",\"type\":\"single\",\"options\":[\"До 40 м²\",\"40-60 м²\",\"60-90 м²\",\"Більше 90 м²\"]},{\"id\":2,\"text\":\"Тип ремонту?\",\"type\":\"single\",\"options\":[\"Косметичний\",\"Капітальний\",\"Євроремонт\",\"Дизайнерський\"]},{\"id\":3,\"text\":\"Терміни виконання?\",\"type\":\"single\",\"options\":[\"1 місяць\",\"2 місяці\",\"3 місяці\",\"Не важливо\"]}]}','{\"layoutType\":\"background\",\"primaryColor\":\"#FFD700\",\"accentColor\":\"#1E90FF\",\"fontFamily\":\"Roboto\",\"titleText\":\"Розрахуйте вартість ремонту за 2 хвилини\",\"subtitleText\":\"Отримайте точну кошторисну вартість та план робіт\",\"buttonText\":\"Розрахувати\",\"bonusText\":\"Дизайн-проект у подарунок\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(5,'Ремонт ванної кімнати','renovation','Спеціалізований квіз для ремонту ванної','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800','{\"questions\":[{\"id\":1,\"text\":\"Площа ванної?\",\"type\":\"single\",\"options\":[\"До 3 м²\",\"3-5 м²\",\"5-8 м²\",\"Більше 8 м²\"]},{\"id\":2,\"text\":\"Що потрібно замінити?\",\"type\":\"multiple\",\"options\":[\"Плитка\",\"Сантехніка\",\"Електрика\",\"Вентиляція\"]},{\"id\":3,\"text\":\"Бюджет на ремонт?\",\"type\":\"single\",\"options\":[\"До 50 000 грн\",\"50 000 - 100 000 грн\",\"100 000 - 200 000 грн\",\"Більше 200 000 грн\"]}]}','{\"layoutType\":\"center\",\"primaryColor\":\"#00CED1\",\"accentColor\":\"#FF69B4\",\"fontFamily\":\"Poppins\",\"titleText\":\"Ванна кімната мрії\",\"subtitleText\":\"Сучасний дизайн та якісні матеріали\",\"buttonText\":\"Почати\",\"bonusText\":\"Знижка 10% на матеріали\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(6,'Ремонт офісу','renovation','Комерційний ремонт офісних приміщень','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800','{\"questions\":[{\"id\":1,\"text\":\"Площа офісу?\",\"type\":\"single\",\"options\":[\"До 50 м²\",\"50-100 м²\",\"100-200 м²\",\"Більше 200 м²\"]},{\"id\":2,\"text\":\"Кількість робочих місць?\",\"type\":\"single\",\"options\":[\"До 5\",\"5-15\",\"15-30\",\"Більше 30\"]},{\"id\":3,\"text\":\"Потрібні переговорні?\",\"type\":\"single\",\"options\":[\"Так, 1\",\"Так, 2-3\",\"Так, більше 3\",\"Не потрібно\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#4169E1\",\"accentColor\":\"#32CD32\",\"fontFamily\":\"Open Sans\",\"titleText\":\"Сучасний офіс для вашого бізнесу\",\"subtitleText\":\"Функціональний дизайн та ергономіка\",\"buttonText\":\"Отримати розрахунок\",\"bonusText\":\"Безкоштовний замір та консультація\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(7,'Підбір ноутбука','ecommerce','Допоможіть клієнтам вибрати ідеальний ноутбук','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800','{\"questions\":[{\"id\":1,\"text\":\"Для яких цілей потрібен ноутбук?\",\"type\":\"single\",\"options\":[\"Робота з документами\",\"Програмування\",\"Дизайн/Відео\",\"Ігри\"]},{\"id\":2,\"text\":\"Діагональ екрану?\",\"type\":\"single\",\"options\":[\"13-14 дюймів\",\"15-16 дюймів\",\"17+ дюймів\",\"Не важливо\"]},{\"id\":3,\"text\":\"Ваш бюджет?\",\"type\":\"single\",\"options\":[\"До 20 000 грн\",\"20 000 - 40 000 грн\",\"40 000 - 70 000 грн\",\"Більше 70 000 грн\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#FACC15\",\"accentColor\":\"#3B82F6\",\"fontFamily\":\"Inter\",\"titleText\":\"Підберіть ноутбук під ваші цілі\",\"subtitleText\":\"Отримайте 30% знижку на засоби по догляду за гаджетами\",\"buttonText\":\"Підібрати\",\"bonusText\":\"Промокод з 30% знижкою\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(8,'Підбір смартфона','ecommerce','Квіз для вибору смартфона','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800','{\"questions\":[{\"id\":1,\"text\":\"Операційна система?\",\"type\":\"single\",\"options\":[\"Android\",\"iOS\",\"Не важливо\"]},{\"id\":2,\"text\":\"Пріоритет при виборі?\",\"type\":\"single\",\"options\":[\"Камера\",\"Продуктивність\",\"Батарея\",\"Дизайн\"]},{\"id\":3,\"text\":\"Бюджет?\",\"type\":\"single\",\"options\":[\"До 10 000 грн\",\"10 000 - 20 000 грн\",\"20 000 - 40 000 грн\",\"Більше 40 000 грн\"]}]}','{\"layoutType\":\"background\",\"primaryColor\":\"#10B981\",\"accentColor\":\"#F59E0B\",\"fontFamily\":\"Montserrat\",\"titleText\":\"Знайдіть ідеальний смартфон\",\"subtitleText\":\"Підбір за 1 хвилину з гарантією найкращої ціни\",\"buttonText\":\"Знайти\",\"bonusText\":\"Безкоштовна доставка\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(9,'Підбір навушників','ecommerce','Допомога у виборі навушників','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800','{\"questions\":[{\"id\":1,\"text\":\"Тип навушників?\",\"type\":\"single\",\"options\":[\"Вкладиші (TWS)\",\"Накладні\",\"Повнорозмірні\",\"Спортивні\"]},{\"id\":2,\"text\":\"Потрібне шумозаглушення?\",\"type\":\"single\",\"options\":[\"Так, обов\'язково\",\"Бажано\",\"Не важливо\"]},{\"id\":3,\"text\":\"Бюджет?\",\"type\":\"single\",\"options\":[\"До 2 000 грн\",\"2 000 - 5 000 грн\",\"5 000 - 10 000 грн\",\"Більше 10 000 грн\"]}]}','{\"layoutType\":\"center\",\"primaryColor\":\"#8B5CF6\",\"accentColor\":\"#EC4899\",\"fontFamily\":\"Poppins\",\"titleText\":\"Ідеальний звук для вас\",\"subtitleText\":\"Підберемо навушники під ваш стиль життя\",\"buttonText\":\"Підібрати\",\"bonusText\":\"Подарунковий чохол\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(10,'Юридична консультація','services','Квіз для підбору юридичних послуг','https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800','{\"questions\":[{\"id\":1,\"text\":\"Тип питання?\",\"type\":\"single\",\"options\":[\"Сімейне право\",\"Бізнес\",\"Нерухомість\",\"Кримінальне\"]},{\"id\":2,\"text\":\"Термін вирішення?\",\"type\":\"single\",\"options\":[\"Терміново (1-3 дні)\",\"Звичайний (тиждень)\",\"Не терміново\"]},{\"id\":3,\"text\":\"Бюджет на послуги?\",\"type\":\"single\",\"options\":[\"До 5 000 грн\",\"5 000 - 15 000 грн\",\"15 000 - 50 000 грн\",\"Більше 50 000 грн\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#1E40AF\",\"accentColor\":\"#D97706\",\"fontFamily\":\"Roboto\",\"titleText\":\"Професійна юридична допомога\",\"subtitleText\":\"Безкоштовна консультація за результатами тесту\",\"buttonText\":\"Отримати консультацію\",\"bonusText\":\"Перша консультація безкоштовно\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(11,'Бухгалтерські послуги','services','Підбір бухгалтерського обслуговування','https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800','{\"questions\":[{\"id\":1,\"text\":\"Форма власності?\",\"type\":\"single\",\"options\":[\"ФОП\",\"ТОВ\",\"ПП\",\"Інше\"]},{\"id\":2,\"text\":\"Система оподаткування?\",\"type\":\"single\",\"options\":[\"Загальна\",\"Спрощена\",\"Єдиний податок\",\"Не знаю\"]},{\"id\":3,\"text\":\"Кількість працівників?\",\"type\":\"single\",\"options\":[\"Без працівників\",\"1-5\",\"5-20\",\"Більше 20\"]}]}','{\"layoutType\":\"background\",\"primaryColor\":\"#059669\",\"accentColor\":\"#DC2626\",\"fontFamily\":\"Open Sans\",\"titleText\":\"Бухгалтерія без головного болю\",\"subtitleText\":\"Повний супровід вашого бізнесу\",\"buttonText\":\"Розрахувати вартість\",\"bonusText\":\"Перший місяць зі знижкою 50%\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(12,'Маркетингові послуги','services','Підбір маркетингової стратегії','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800','{\"questions\":[{\"id\":1,\"text\":\"Ваша ніша?\",\"type\":\"single\",\"options\":[\"E-commerce\",\"Послуги\",\"B2B\",\"Інше\"]},{\"id\":2,\"text\":\"Які канали цікавлять?\",\"type\":\"multiple\",\"options\":[\"Google Ads\",\"Facebook/Instagram\",\"TikTok\",\"SEO\",\"Email\"]},{\"id\":3,\"text\":\"Місячний бюджет?\",\"type\":\"single\",\"options\":[\"До 20 000 грн\",\"20 000 - 50 000 грн\",\"50 000 - 100 000 грн\",\"Більше 100 000 грн\"]}]}','{\"layoutType\":\"center\",\"primaryColor\":\"#F97316\",\"accentColor\":\"#8B5CF6\",\"fontFamily\":\"Montserrat\",\"titleText\":\"Збільште продажі в 3 рази\",\"subtitleText\":\"Персональна маркетингова стратегія для вашого бізнесу\",\"buttonText\":\"Отримати стратегію\",\"bonusText\":\"Аудит рекламних кампаній безкоштовно\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(13,'Підбір квартири','realestate','Допомога у виборі квартири','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800','{\"questions\":[{\"id\":1,\"text\":\"Кількість кімнат?\",\"type\":\"single\",\"options\":[\"1-кімнатна\",\"2-кімнатна\",\"3-кімнатна\",\"4+ кімнати\"]},{\"id\":2,\"text\":\"Район міста?\",\"type\":\"single\",\"options\":[\"Центр\",\"Спальний район\",\"Передмістя\",\"Не важливо\"]},{\"id\":3,\"text\":\"Бюджет?\",\"type\":\"single\",\"options\":[\"До 1 млн грн\",\"1-2 млн грн\",\"2-3 млн грн\",\"Більше 3 млн грн\"]}]}','{\"layoutType\":\"split\",\"primaryColor\":\"#2563EB\",\"accentColor\":\"#F59E0B\",\"fontFamily\":\"Inter\",\"titleText\":\"Знайдіть ідеальну квартиру\",\"subtitleText\":\"Персональна підбірка з 1000+ варіантів\",\"buttonText\":\"Підібрати квартиру\",\"bonusText\":\"Юридичний супровід безкоштовно\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(14,'Оренда житла','realestate','Квіз для пошуку житла в оренду','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800','{\"questions\":[{\"id\":1,\"text\":\"Тип житла?\",\"type\":\"single\",\"options\":[\"Квартира\",\"Будинок\",\"Кімната\",\"Студія\"]},{\"id\":2,\"text\":\"Термін оренди?\",\"type\":\"single\",\"options\":[\"1-3 місяці\",\"3-6 місяців\",\"6-12 місяців\",\"Більше року\"]},{\"id\":3,\"text\":\"Бюджет на місяць?\",\"type\":\"single\",\"options\":[\"До 10 000 грн\",\"10 000 - 20 000 грн\",\"20 000 - 30 000 грн\",\"Більше 30 000 грн\"]}]}','{\"layoutType\":\"background\",\"primaryColor\":\"#10B981\",\"accentColor\":\"#6366F1\",\"fontFamily\":\"Poppins\",\"titleText\":\"Комфортне житло в оренду\",\"subtitleText\":\"Знайдемо варіант за 24 години\",\"buttonText\":\"Знайти житло\",\"bonusText\":\"Без комісії для орендарів\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15'),(15,'Комерційна нерухомість','realestate','Підбір комерційної нерухомості','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800','{\"questions\":[{\"id\":1,\"text\":\"Тип приміщення?\",\"type\":\"single\",\"options\":[\"Офіс\",\"Магазин\",\"Склад\",\"Виробництво\"]},{\"id\":2,\"text\":\"Площа?\",\"type\":\"single\",\"options\":[\"До 50 м²\",\"50-100 м²\",\"100-300 м²\",\"Більше 300 м²\"]},{\"id\":3,\"text\":\"Мета?\",\"type\":\"single\",\"options\":[\"Купівля\",\"Оренда\",\"Ще не вирішив\"]}]}','{\"layoutType\":\"center\",\"primaryColor\":\"#DC2626\",\"accentColor\":\"#0891B2\",\"fontFamily\":\"Roboto\",\"titleText\":\"Комерційна нерухомість для бізнесу\",\"subtitleText\":\"Професійний підбір з урахуванням всіх вимог\",\"buttonText\":\"Підібрати приміщення\",\"bonusText\":\"Консультація експерта безкоштовно\"}',1,0,'2025-12-13 21:12:15','2025-12-13 21:12:15');
/*!40000 ALTER TABLE `quiz_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` (`id`, `name`, `slug`, `description`, `isActive`, `createdBy`, `createdAt`, `updatedAt`, `quizType`, `platform`, `niche`) VALUES (11,'Інтернет-магазин без продажів — це зламаний таргет','ecommerce-meta','Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення',1,1,'2025-12-15 19:32:22','2025-12-15 19:32:22','lead_generation','meta_ads','ecommerce'),(12,'Google Ads для інтернет-магазину — не трафік, а продажі','ecommerce-google','Налаштовуємо Search і Shopping рекламу з контролем окупності та реального результату',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','ecommerce'),(13,'Ремонт без заявок — значить реклама налаштована криво','renovation-meta','Беремо Meta рекламу для ремонту квартир під контроль: заявки, стабільність, масштаб',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','renovation'),(14,'Google Ads для ремонту квартир — заявки з пошуку','renovation-google','Налаштовуємо Google рекламу для ремонтних компаній з фокусом на реальних клієнтів',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','renovation'),(15,'Меблева реклама без заявок — проблема не в ринку','furniture-meta','Запускаємо Meta Ads для меблевих компаній з фокусом на заявки',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','furniture'),(16,'Google Ads для меблів — клієнти з пошуку','furniture-google','Беремо під контроль пошукову рекламу для меблевого бізнесу',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','furniture'),(17,'Telegram без результату — реклама ллється не туди','telegram-meta','Запускаємо Meta рекламу для Telegram-проєктів з фокусом на живу аудиторію',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','services'),(18,'Google Ads для Telegram — трафік з наміром','telegram-google','Налаштовуємо пошукову рекламу під Telegram-воронки',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','services'),(19,'Будівництво без заявок — реклама працює на конкурентів','construction-meta','Запускаємо Meta рекламу для будівельних компаній з фокусом на якісні заявки',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','services'),(20,'Google Ads для будівництва — клієнти з пошуку','construction-google','Налаштовуємо Google рекламу для будівельних компаній з фокусом на реальних замовників',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','services'),(21,'Доставка їжі без замовлень — таргет не працює','food-delivery-meta','Запускаємо Meta рекламу для доставки їжі з фокусом на замовлення та повторні покупки',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','services'),(22,'Google Ads для доставки їжі — замовлення з пошуку','food-delivery-google','Налаштовуємо Google рекламу для доставки їжі з фокусом на конверсії',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','services'),(23,'B2B реклама без якісних заявок — злитий бюджет','b2b-meta','Запускаємо Meta Ads для B2B з фокусом на ЛПР і угоди',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','services'),(24,'Google Ads для B2B — заявки від бізнесу','b2b-google','Беремо під контроль Google рекламу для B2B-компаній',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','services'),(25,'Реклама без результату — проблема в налаштуванні','general-meta','Запускаємо Meta рекламу для вашого бізнесу з фокусом на реальний результат',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','meta_ads','other'),(26,'Google Ads без результату — налаштуємо правильно','general-google','Беремо під контроль Google рекламу для вашого бізнесу',1,1,'2025-12-15 19:32:23','2025-12-15 19:32:23','lead_generation','google_ads','other');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sales_scripts`
--

LOCK TABLES `sales_scripts` WRITE;
/*!40000 ALTER TABLE `sales_scripts` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_scripts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `scheduled_calls`
--

LOCK TABLES `scheduled_calls` WRITE;
/*!40000 ALTER TABLE `scheduled_calls` DISABLE KEYS */;
/*!40000 ALTER TABLE `scheduled_calls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `scheduled_messages`
--

LOCK TABLES `scheduled_messages` WRITE;
/*!40000 ALTER TABLE `scheduled_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `scheduled_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` (`id`, `settingKey`, `settingValue`, `updatedAt`) VALUES (1,'auto_assign_enabled','true','2025-12-07 15:33:59');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` (`id`, `name`, `position`, `bio`, `photoUrl`, `experience`, `metaBlueprintCertified`, `googleAdsCertified`, `tiktokCertified`, `linkedinUrl`, `facebookUrl`, `instagramUrl`, `telegramUrl`, `orderIndex`, `isActive`, `createdAt`, `updatedAt`) VALUES (1,'Олександр Коваленко','Performance Marketing Manager','Спеціалізується на Meta Ads та Google Ads. Запустив понад 200 успішних кампаній для e-commerce та B2B.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop','7+ років досвіду',1,1,0,'https://linkedin.com',NULL,NULL,NULL,1,1,'2025-12-23 22:30:21','2025-12-23 22:30:21'),(2,'Марія Шевченко','Lead Generation Specialist','Експерт з генерації лідів через соціальні мережі. Середній ROI клієнтів — 250%.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop','5+ років досвіду',1,0,1,NULL,NULL,'https://instagram.com',NULL,2,1,'2025-12-23 22:30:21','2025-12-23 22:30:21'),(3,'Дмитро Петренко','Data Analyst & CRO Expert','Аналізує дані та оптимізує конверсії. Збільшив CR клієнтів у середньому на 180%.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop','6+ років досвіду',0,1,0,'https://linkedin.com','https://facebook.com',NULL,NULL,3,1,'2025-12-23 22:30:21','2025-12-23 22:30:21'),(4,'Олександр Коваленко','Performance Marketing Manager','Спеціалізується на Meta Ads та Google Ads. Запустив понад 200 успішних кампаній для e-commerce та B2B.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop','7+ років досвіду',1,1,0,'https://linkedin.com',NULL,NULL,NULL,1,1,'2025-12-23 22:30:47','2025-12-23 22:30:47'),(5,'Марія Шевченко','Lead Generation Specialist','Експерт з генерації лідів через соціальні мережі. Середній ROI клієнтів — 250%.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop','5+ років досвіду',1,0,1,NULL,NULL,'https://instagram.com',NULL,2,1,'2025-12-23 22:30:47','2025-12-23 22:30:47'),(6,'Дмитро Петренко','Data Analyst & CRO Expert','Аналізує дані та оптимізує конверсії. Збільшив CR клієнтів у середньому на 180%.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop','6+ років досвіду',0,1,0,'https://linkedin.com','https://facebook.com',NULL,NULL,3,1,'2025-12-23 22:30:47','2025-12-23 22:30:47');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userInvitations`
--

LOCK TABLES `userInvitations` WRITE;
/*!40000 ALTER TABLE `userInvitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `userInvitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `passwordHash`, `isActive`, `telegramChatId`) VALUES (1,'PikaLeads Work','pikaleadswork@gmail.com','admin','2025-12-07 15:29:30','2025-12-24 22:01:09','2025-12-24 22:01:09','$2b$10$urnmuryPFEk.WjP3zWzmMe4154iWLwz4FzOHXYO0506GcOYT4L8HW',1,NULL),(3,'Admin Test','admin@pikaleads.com','admin','2025-12-07 15:33:45','2025-12-20 19:09:07','2025-12-20 19:09:08','$2b$10$mrT7QBR5TYFMt65UCWmEIuk.9AkKzStGEUs7i0t82sm63N7ADUrKy',1,NULL),(4,'Олександр','manager1@pikaleads.com','manager','2025-12-07 15:33:49','2025-12-17 13:19:07','2025-12-07 15:33:49','',1,NULL),(5,'Артур','manager2@pikaleads.com','manager','2025-12-07 15:33:54','2025-12-17 13:19:07','2025-12-07 15:33:54','',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `webhookLogs`
--

LOCK TABLES `webhookLogs` WRITE;
/*!40000 ALTER TABLE `webhookLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhookLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `webhooks`
--

LOCK TABLES `webhooks` WRITE;
/*!40000 ALTER TABLE `webhooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhooks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-25 16:15:13
