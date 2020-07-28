# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 116.62.57.248 (MySQL 5.6.35)
# Database: lianqi
# Generation Time: 2020-07-28 08:58:40 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table feed_back
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feed_back`;

CREATE TABLE `feed_back` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `content` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `feed_back` WRITE;
/*!40000 ALTER TABLE `feed_back` DISABLE KEYS */;

INSERT INTO `feed_back` (`id`, `user_id`, `type`, `content`)
VALUES
	(1,100484,0,'反馈问题测试'),
	(2,100484,0,'反馈bug'),
	(3,100484,3,'反馈充值问题'),
	(4,100484,4,'改进'),
	(5,100516,2,'奖励什么时候发？'),
	(6,100536,3,'奖励什么时候发放'),
	(7,100543,0,'哇'),
	(8,100546,4,'修复web提'),
	(9,100714,2,',,,,hhhhhh'),
	(10,101151,0,'lksadjflklkasjdfl'),
	(11,101151,2,'rlklanbldksjfl');

/*!40000 ALTER TABLE `feed_back` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table lianqi_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `lianqi_user`;

CREATE TABLE `lianqi_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `area` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `name` varchar(30) CHARACTER SET utf8mb4 NOT NULL DEFAULT '游客',
  `sex` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `head` varchar(255) NOT NULL DEFAULT '1',
  `vip` int(11) NOT NULL DEFAULT '0',
  `gold` int(11) NOT NULL DEFAULT '10',
  `win` int(11) unsigned NOT NULL DEFAULT '0',
  `win_rate` double DEFAULT NULL,
  `lose` int(11) unsigned NOT NULL DEFAULT '0',
  `draw` int(11) unsigned NOT NULL DEFAULT '0',
  `escape` int(11) unsigned NOT NULL DEFAULT '0',
  `talent` int(11) unsigned NOT NULL DEFAULT '0',
  `game_time` int(11) unsigned NOT NULL DEFAULT '0',
  `exp` int(11) unsigned NOT NULL DEFAULT '0',
  `phone` int(11) unsigned NOT NULL DEFAULT '0',
  `room_id` int(11) unsigned NOT NULL DEFAULT '0',
  `adult` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `charm` int(11) unsigned NOT NULL DEFAULT '0',
  `score` int(11) NOT NULL DEFAULT '0',
  `diamond` int(11) unsigned NOT NULL DEFAULT '0',
  `energy` int(11) unsigned NOT NULL DEFAULT '10',
  `lastlogin_time` datetime DEFAULT NULL,
  `register_time` datetime DEFAULT NULL,
  `client_type` tinyint(1) unsigned DEFAULT NULL,
  `client_ip` int(11) DEFAULT NULL,
  `client_appver` int(11) unsigned DEFAULT NULL,
  `client_osver` int(11) unsigned DEFAULT NULL,
  `deviceid` varchar(255) NOT NULL DEFAULT '',
  `logintype` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `channelid` int(11) unsigned NOT NULL,
  `networktype` tinyint(1) unsigned DEFAULT NULL,
  `serverId` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `lianqi_user` WRITE;
/*!40000 ALTER TABLE `lianqi_user` DISABLE KEYS */;

INSERT INTO `lianqi_user` (`id`, `area`, `name`, `sex`, `head`, `vip`, `gold`, `win`, `win_rate`, `lose`, `draw`, `escape`, `talent`, `game_time`, `exp`, `phone`, `room_id`, `adult`, `charm`, `score`, `diamond`, `energy`, `lastlogin_time`, `register_time`, `client_type`, `client_ip`, `client_appver`, `client_osver`, `deviceid`, `logintype`, `channelid`, `networktype`, `serverId`)
VALUES
	(101166,1,'游客101166',0,'1',0,2120,1,100,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-01-29 12:16:08','2018-01-02 15:35:37',0,1111,101010,10000,'b1a0c1e6c6e1d738e30b87b785ede077',1,20001,1,'connector-server-1'),
	(101167,1,'游客101167',0,'1',0,3210,1,25,3,0,0,4,0,0,0,0,1,0,0,800,20,'2019-11-03 15:32:16','2018-01-02 15:44:02',0,1111,101010,10000,'76625059-1634-5688-8CB3-14BC4C131BE5',1,20001,1,'connector-server-1'),
	(101168,1,'游客101168',0,'1',0,1000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-01-04 13:50:49','2018-01-04 13:50:49',0,1111,101010,10000,'d7dc35022b1e1e91d683e6da70cc4d31',1,20001,NULL,'connector-server-1'),
	(101169,1,'游客101169',0,'1',0,1000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-01-18 13:12:09','2018-01-18 13:12:09',0,1111,101010,10000,'1482521300',1,20001,NULL,'connector-server-1'),
	(101170,1,'游客101170',0,'1',0,1000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-05-06 00:34:32','2018-05-06 00:34:32',0,1111,101010,10000,'1487252433',1,20001,NULL,'connector-server-1'),
	(101171,1,'游客101171',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-05-21 22:24:13','2018-05-21 22:24:13',0,1111,101010,10000,'417164630',1,20001,NULL,'connector-server-1'),
	(101172,1,'游客101172',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-06-08 22:29:46','2018-06-08 22:29:46',0,1111,101010,10000,'1733410996',1,20001,NULL,'connector-server-1'),
	(101173,1,'游客101173',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2018-09-15 20:30:39','2018-09-15 20:30:39',0,1111,101010,10000,'1090408346',1,20001,NULL,'connector-server-1'),
	(101174,1,'游客101174',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2019-06-01 00:40:11','2019-06-01 00:40:11',0,1111,101010,10000,'425820483',1,20001,NULL,'connector-server-1'),
	(101175,1,'游客101175',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2019-06-30 01:49:05','2019-06-30 01:49:05',0,1111,101010,10000,'425892894',1,20001,NULL,'connector-server-1'),
	(101176,1,'游客101176',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2019-12-22 03:20:33','2019-12-22 03:20:33',0,1111,101010,10000,'1506836148',1,20001,NULL,'connector-server-1'),
	(101177,1,'游客101177',0,'1',0,2000,0,0,0,0,0,0,0,0,0,0,1,0,0,1000,20,'2020-04-23 18:22:55','2020-04-23 18:22:55',0,1111,101010,10000,'992714371',1,20001,NULL,'connector-server-1'),
	(101178,1,'iniwap',1,'http://thirdqq.qlogo.cn/g?b=oidb&k=XX&s=100&t=1024',0,1000,0,0,0,0,0,1,0,0,0,0,1,0,0,950,20,'2020-06-22 14:36:38','2020-06-22 14:36:38',0,1111,101010,10000,'D9C5C75C-9892-49DA-BF87-319A1C09832C',2,20001,NULL,'connector-server-1');

/*!40000 ALTER TABLE `lianqi_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table luckdraw_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `luckdraw_config`;

CREATE TABLE `luckdraw_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) NOT NULL,
  `prop_id` int(11) DEFAULT NULL,
  `gold_num` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `luckdraw_config` WRITE;
/*!40000 ALTER TABLE `luckdraw_config` DISABLE KEYS */;

INSERT INTO `luckdraw_config` (`id`, `type`, `prop_id`, `gold_num`)
VALUES
	(1,1,0,100),
	(2,1,0,200),
	(3,2,1,0),
	(4,1,0,500),
	(5,1,0,1000),
	(6,2,2,0);

/*!40000 ALTER TABLE `luckdraw_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table notice_msg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notice_msg`;

CREATE TABLE `notice_msg` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL DEFAULT '2',
  `content` varchar(255) NOT NULL DEFAULT '系统公告',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `notice_msg` WRITE;
/*!40000 ALTER TABLE `notice_msg` DISABLE KEYS */;

INSERT INTO `notice_msg` (`id`, `type`, `content`)
VALUES
	(1,2,'{\"type\":0,\"content\":\"欢迎来到<color=#7ea700><b>吃货联盟</b></color>，开启你的游戏之旅吧，祝您玩的愉快\",\"playCnt\":3}'),
	(2,2,'{\"type\":0,\"content\":\"今晚0点系统将<color=#d8252e>停机维护</color>，感谢您的理解和支持\",\"playCnt\":5}'),
	(3,2,'{\"type\":1,\"content\":\"恭喜<color=#7ea700>国服第一、浪</color>获得永久皮肤<color=#d8252e><b>旗开得胜</b></color>\",\"playCnt\":2}');

/*!40000 ALTER TABLE `notice_msg` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table plaza_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `plaza_config`;

CREATE TABLE `plaza_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `plazaid` int(11) NOT NULL,
  `room_type` int(11) NOT NULL,
  `star` double NOT NULL,
  `lmt_type` tinyint(3) NOT NULL DEFAULT '0',
  `rule` varchar(1024) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `des` varchar(1024) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `plaza_config` WRITE;
/*!40000 ALTER TABLE `plaza_config` DISABLE KEYS */;

INSERT INTO `plaza_config` (`id`, `plazaid`, `room_type`, `star`, `lmt_type`, `rule`, `name`, `des`)
VALUES
	(1,10001,1,3,1,'{\"playerNum\":4,\"gridLevel\":6,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":200,\"lmtTurnTime\":30}','三禁手','<color=#261601>晴天霹雳 每回合增加</color><color=#507201>禁手</color><color=#261601>一次</color>\n<color=#d8252e>特殊奖励:</color><color=#261601>吃子越多 奖励越高</color>'),
	(2,10002,1,4,1,'{\"playerNum\":2,\"gridLevel\":4,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":200,\"lmtTurnTime\":9}','时间极限','<color=#261601>人有三急 思考时间仅有<color=#507201>9</color>秒</color>\n<color=#d8252e>特殊奖励:</color><color=#261601>总时间消耗越少 奖励越高</color>'),
	(3,10003,1,3.5,1,'{\"playerNum\":3,\"gridLevel\":6,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":200,\"lmtTurnTime\":20}','双人环环扣','<color=#261601>手牵手心连心 所有人只能以</color><color=#507201>环形</color><color=#261601>布阵</color>\n<color=#d8252e>特殊奖励:</color><color=#261601>环形越多 或圈地范围越大 奖励越高</color>'),
	(4,10004,1,2,1,'{\"playerNum\":2,\"gridLevel\":4,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":0,\"lmtTurnTime\":20}','血战到底','<color=#261601>领先5子获胜 最后胜出者获得全部奖池</color>\n<color=#d8252e>特殊奖励:</color><color=#261601>最后幸存者 奖励最大</color>'),
	(9,10005,0,2,1,'{\"playerNum\":2,\"gridLevel\":4,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":0,\"lmtTurnTime\":20}','双人四阶','经典模式'),
	(10,10006,0,2,1,'{\"playerNum\":2,\"gridLevel\":6,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":0,\"lmtTurnTime\":20}','双人六阶','经典模式'),
	(11,10007,0,2,1,'{\"playerNum\":4,\"gridLevel\":6,\"rule\":\"default\",\"gameTime\":\"360\",\"lmtRound\":0,\"lmtTurnTime\":20}','四人六阶','经典模式');

/*!40000 ALTER TABLE `plaza_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table plaza_lmt_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `plaza_lmt_config`;

CREATE TABLE `plaza_lmt_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `plazaid` int(11) DEFAULT NULL,
  `base_score` int(11) DEFAULT NULL,
  `minsr` int(11) DEFAULT NULL,
  `maxsr` int(11) DEFAULT NULL,
  `levelid` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `plaza_lmt_config` WRITE;
/*!40000 ALTER TABLE `plaza_lmt_config` DISABLE KEYS */;

INSERT INTO `plaza_lmt_config` (`id`, `plazaid`, `base_score`, `minsr`, `maxsr`, `levelid`)
VALUES
	(1,10001,50,50,1000,1),
	(2,10001,500,1000,10000,2),
	(3,10001,5000,10000,0,3),
	(4,10002,50,50,1000,1),
	(5,10002,500,1000,10000,2),
	(6,10002,5000,10000,0,3),
	(7,10003,50,50,1000,1),
	(8,10003,500,1000,10000,2),
	(9,10003,5000,10000,0,3),
	(10,10004,50,50,1000,1),
	(11,10004,500,1000,10000,2),
	(12,10004,5000,10000,0,3),
	(13,10005,50,50,1000,1),
	(14,10005,500,1000,10000,2),
	(15,10005,5000,10000,0,3),
	(16,10006,50,50,1000,1),
	(17,10006,500,1000,10000,2),
	(18,10006,5000,10000,0,3),
	(19,10007,50,50,1000,1),
	(20,10007,500,1000,10000,2),
	(21,10007,5000,10000,0,3);

/*!40000 ALTER TABLE `plaza_lmt_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table prop_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `prop_config`;

CREATE TABLE `prop_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) NOT NULL,
  `price` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '道具名字',
  `pic` varchar(255) NOT NULL DEFAULT '道具图片',
  `des` varchar(255) NOT NULL DEFAULT '道具描述',
  `data` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `prop_config` WRITE;
/*!40000 ALTER TABLE `prop_config` DISABLE KEYS */;

INSERT INTO `prop_config` (`id`, `type`, `price`, `name`, `pic`, `des`, `data`)
VALUES
	(1,1,1,'全服喇叭','1','向全服喊话吧～',''),
	(2,1,1,'金币经验双倍卡','2','金币经验双倍赢取',''),
	(3,2,6,'皮肤01','3','史诗级皮肤皮卡丘',''),
	(4,2,6,'皮肤02','4','勇者皮肤米罗',''),
	(5,2,12,'皮肤03','http//iafun.com/skin/1.png','情人节限定皮肤',''),
	(6,3,20,'英雄01','10','米罗大师',''),
	(7,3,50,'英雄02','11','爱豆',''),
	(8,3,100,'英雄03','12','王者',''),
	(9,2,1000,'英雄宝箱','13','开启随机获得一种英雄','可以随机出任意一种英雄'),
	(10,2,2000,'皮肤宝箱','14','开启获得任意一种皮肤','可以随机出4,5两种皮肤任一种，例如{propid=4,5;random=0.2,0.8}，代表从4，5两种随机，概率为0.2，0.8,运营后台配置，插入数据组装成该格式');

/*!40000 ALTER TABLE `prop_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table signin_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `signin_config`;

CREATE TABLE `signin_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) NOT NULL,
  `day` tinyint(3) NOT NULL,
  `prop_id` int(11) DEFAULT NULL,
  `gold_num` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `signin_config` WRITE;
/*!40000 ALTER TABLE `signin_config` DISABLE KEYS */;

INSERT INTO `signin_config` (`id`, `type`, `day`, `prop_id`, `gold_num`)
VALUES
	(1,1,1,0,100),
	(2,1,2,0,200),
	(3,2,3,1,0),
	(4,2,4,2,0),
	(5,1,5,0,500),
	(6,1,6,0,1000),
	(7,2,7,3,0);

/*!40000 ALTER TABLE `signin_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table store_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `store_config`;

CREATE TABLE `store_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `point` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `des` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `data` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `store_config` WRITE;
/*!40000 ALTER TABLE `store_config` DISABLE KEYS */;

INSERT INTO `store_config` (`id`, `point`, `price`, `name`, `des`, `pic`, `data`)
VALUES
	(1,'com.iafun.lianqi.laba',1,'全服喇叭','','1',''),
	(2,'com.iafun.lianqi.hero01',6,'米罗大师','','2',''),
	(3,'com.iafun.lianqi.hero02',12,'王者','','3',''),
	(4,'com.iafun.lianqi.skin01',6,'史诗皮肤','','4',''),
	(5,'com.iafun.lianqi.skin03',6,'情人节限定','','5',''),
	(6,'com.iafun.lianqi.hero03',12,'皮卡丘','','6',''),
	(7,'com.iafun.lianqi.exp01',1,'双倍经验卡','','7','');

/*!40000 ALTER TABLE `store_config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table third_party
# ------------------------------------------------------------

DROP TABLE IF EXISTS `third_party`;

CREATE TABLE `third_party` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `head_url` varchar(2048) NOT NULL DEFAULT '',
  `sex` tinyint(1) NOT NULL DEFAULT '0',
  `openid` varchar(255) NOT NULL DEFAULT '',
  `nick` varchar(255) NOT NULL DEFAULT '',
  `authtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `outtime` int(11) NOT NULL DEFAULT '168',
  `access_token` varchar(2048) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `third_party` WRITE;
/*!40000 ALTER TABLE `third_party` DISABLE KEYS */;

INSERT INTO `third_party` (`id`, `head_url`, `sex`, `openid`, `nick`, `authtime`, `outtime`, `access_token`, `user_id`)
VALUES
	(6,'http://q.qlogo.cn/qqapp/1106301431/XX/100',1,'XX','Elif','2018-01-02 14:03:24',7775999,'XX',101165),
	(7,'http://thirdqq.qlogo.cn/g?b=oidb&k=XX&s=100&t=1024',1,'XXX','iniwap','2020-06-22 14:36:38',7775999,'XX',101178);

/*!40000 ALTER TABLE `third_party` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_email
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email`;

CREATE TABLE `user_email` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `has_read` tinyint(1) NOT NULL DEFAULT '0',
  `title` varchar(30) NOT NULL DEFAULT '',
  `content` varchar(1024) NOT NULL DEFAULT '',
  `author` varchar(30) NOT NULL DEFAULT '',
  `send_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_email` WRITE;
/*!40000 ALTER TABLE `user_email` DISABLE KEYS */;

INSERT INTO `user_email` (`id`, `user_id`, `type`, `has_read`, `title`, `content`, `author`, `send_time`, `end_time`)
VALUES
	(1,100001,0,0,'xx发来的消息','这是一条测试消息','xx','2017-04-11 23:55:18','2017-04-11 23:55:18'),
	(2,100001,1,0,'xx发来的消息','开黑求组','','2017-04-11 23:55:18','2017-04-11 23:55:18'),
	(3,100001,1,0,'xx发来的消息','开黑求组','','2017-04-11 23:55:18','2017-04-11 23:55:18'),
	(4,100001,0,0,'xx发来的消息','a a a a a','','2017-04-11 23:55:18','2017-04-11 23:55:18'),
	(5,100271,0,0,'新玩家送积分','{\"content\":\"新玩家免费赠送1000积分，游戏多多，奖励多多\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":1000,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-09 11:30:22',NULL),
	(1199,100666,0,0,'每日登录送积分','{\"content\":\"每日登录游戏，就送100积分，祝您游戏愉快～！\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":100,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-17 15:39:21','2117-04-23 15:39:21');

INSERT INTO `user_email` (`id`, `user_id`, `type`, `has_read`, `title`, `content`, `author`, `send_time`, `end_time`)
VALUES
	(1200,100666,0,0,'每日登录送积分','{\"content\":\"每日登录游戏，就送100积分，祝您游戏愉快～！\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":100,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-17 15:49:10','2117-04-23 15:49:10'),
	(1201,100666,0,0,'每日登录送积分','{\"content\":\"每日登录游戏，就送100积分，祝您游戏愉快～！\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":100,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-17 15:49:19','2117-04-23 15:49:19'),
	(1202,100687,0,1,'新玩家送积分','{\"content\":\"新玩家免费赠送1000积分，游戏多多，奖励多多\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":1000,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-17 15:50:04','2117-04-23 15:50:04'),
	(1203,100687,0,0,'系统消息','{\"content\":\"欢迎来到联棋世界,祝您游戏愉快\",\"hasAward\":0,\"type\":0,\"propId\":0,\"awardCnt\":0,\"awardIcon\":\"\",\"hasGottenAward\":0}','系统','2017-05-17 15:50:04','2117-04-23 15:50:04'),
	(1204,100687,0,0,'恭喜获得新皮肤','{\"content\":\"恭喜您获得新皮肤:吃遍天下\",\"hasAward\":1,\"type\":2,\"propId\":1,\"awardCnt\":1,\"awardIcon\":\"1\",\"hasGottenAward\":0}','世界联棋委员会','2017-05-17 15:50:04','2117-04-23 15:50:04'),
	(2497,101118,0,1,'恭喜获得新皮肤','{\"content\":\"恭喜您获得新皮肤:吃遍天下\",\"hasAward\":1,\"type\":2,\"propId\":1,\"awardCnt\":1,\"awardIcon\":\"1\",\"hasGottenAward\":1}','世界联棋委员会','2017-06-02 14:23:31','2117-05-09 14:23:31'),
	(2498,101119,0,1,'新玩家送积分','{\"content\":\"新玩家免费赠送1000积分，游戏多多，奖励多多\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":1000,\"awardIcon\":\"\",\"hasGottenAward\":1}','世界联棋委员会','2017-06-02 15:02:20','2117-05-09 15:02:20');

INSERT INTO `user_email` (`id`, `user_id`, `type`, `has_read`, `title`, `content`, `author`, `send_time`, `end_time`)
VALUES
	(2499,101119,0,1,'系统消息','{\"content\":\"欢迎来到联棋世界,祝您游戏愉快\",\"hasAward\":0,\"type\":0,\"propId\":0,\"awardCnt\":0,\"awardIcon\":\"\",\"hasGottenAward\":0}','系统','2017-06-02 15:02:20','2117-05-09 15:02:20'),
	(2843,101165,0,1,'每日登录送积分','{\"content\":\"每日登录游戏，就送100积分，祝您游戏愉快～！\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":100,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2020-05-21 07:36:40','2120-04-27 07:36:40'),
	(2844,101178,0,1,'新玩家送积分','{\"content\":\"新玩家免费赠送1000积分，游戏多多，奖励多多\",\"hasAward\":1,\"type\":1,\"propId\":0,\"awardCnt\":1000,\"awardIcon\":\"\",\"hasGottenAward\":0}','世界联棋委员会','2020-06-22 14:36:38','2120-05-29 14:36:38'),
	(2845,101178,0,0,'系统消息','{\"content\":\"欢迎来到联棋世界,祝您游戏愉快\",\"hasAward\":0,\"type\":0,\"propId\":0,\"awardCnt\":0,\"awardIcon\":\"\",\"hasGottenAward\":0}','系统','2020-06-22 14:36:38','2120-05-29 14:36:38'),
	(2846,101178,0,0,'恭喜获得新皮肤','{\"content\":\"恭喜您获得新皮肤:吃遍天下\",\"hasAward\":1,\"type\":2,\"propId\":1,\"awardCnt\":1,\"awardIcon\":\"1\",\"hasGottenAward\":0}','世界联棋委员会','2020-06-22 14:36:38','2120-05-29 14:36:38');

/*!40000 ALTER TABLE `user_email` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_extrainfo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_extrainfo`;

CREATE TABLE `user_extrainfo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `des` varchar(255) NOT NULL DEFAULT '这家伙很懒，什么也没说',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_extrainfo` WRITE;
/*!40000 ALTER TABLE `user_extrainfo` DISABLE KEYS */;

INSERT INTO `user_extrainfo` (`id`, `user_id`, `des`)
VALUES
	(1,100001,'这家伙很懒，什么也没说');

/*!40000 ALTER TABLE `user_extrainfo` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_friend
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_friend`;

CREATE TABLE `user_friend` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `friend_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_score` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_friend` WRITE;
/*!40000 ALTER TABLE `user_friend` DISABLE KEYS */;

INSERT INTO `user_friend` (`id`, `friend_id`, `user_id`, `friend_score`)
VALUES
	(1,100002,100001,100);

/*!40000 ALTER TABLE `user_friend` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_package
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_package`;

CREATE TABLE `user_package` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `prop_id` int(11) NOT NULL,
  `prop_cnt` int(11) NOT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_package` WRITE;
/*!40000 ALTER TABLE `user_package` DISABLE KEYS */;

INSERT INTO `user_package` (`id`, `user_id`, `prop_id`, `prop_cnt`, `end_time`)
VALUES
	(7,100324,1,1,'2117-04-16 11:36:44'),
	(8,100325,1,1,'2117-04-16 11:38:23'),
	(9,100335,1,1,'2117-04-16 12:13:52'),
	(10,100336,1,1,'2117-04-16 12:14:16'),
	(11,100368,1,1,'2117-04-17 06:04:50'),
	(12,100369,1,1,'2117-04-17 06:08:52'),
	(13,100411,1,1,'2117-04-17 10:23:07'),
	(14,100412,1,1,'2117-04-17 10:26:11'),
	(15,100413,1,1,'2117-04-17 10:30:05'),
	(16,100414,1,1,'2117-04-17 10:33:20'),
	(17,100415,1,1,'2117-04-17 10:35:12'),
	(18,100416,1,1,'2117-04-17 10:36:24'),
	(19,100422,1,1,'2117-04-17 10:57:22'),
	(20,100425,1,1,'2117-04-17 11:18:21'),
	(21,100460,1,1,'2117-04-17 14:51:29'),
	(22,100465,1,1,'2117-04-17 14:57:55'),
	(23,100467,1,1,'2117-04-17 15:00:59'),
	(24,100470,1,1,'2117-04-17 15:03:07'),
	(25,100475,1,1,'2117-04-17 15:13:11'),
	(26,100478,1,1,'2117-04-17 15:15:29'),
	(27,100480,1,1,'2117-04-17 15:17:16'),
	(28,100540,1,1,'2117-04-22 10:16:06'),
	(29,100541,1,1,'2117-04-22 10:19:33'),
	(30,100543,1,1,'2117-04-22 10:41:07'),
	(31,100576,1,1,'2117-04-22 12:13:57'),
	(32,100619,1,1,'2117-04-22 14:09:23'),
	(33,100620,1,1,'2117-04-22 14:10:01'),
	(34,100630,1,1,'2117-04-22 14:33:47'),
	(35,100646,1,1,'2117-04-22 15:54:26'),
	(36,100663,1,1,'2117-04-23 05:03:40'),
	(37,100664,1,1,'2117-04-23 05:05:12'),
	(38,100665,1,1,'2117-04-23 05:07:06'),
	(39,100672,1,1,'2117-04-23 07:02:03'),
	(40,100690,1,1,'2117-04-23 16:04:57'),
	(41,100693,1,1,'2117-04-23 16:09:06'),
	(42,100714,1,1,'2117-04-25 17:19:23'),
	(43,100851,1,1,'2117-04-30 07:05:35'),
	(44,101010,1,1,'2117-05-07 06:22:24'),
	(45,101032,1,1,'2117-05-07 08:04:44'),
	(46,101044,1,1,'2117-05-08 09:37:11'),
	(47,101053,1,1,'2117-05-08 11:39:23'),
	(48,101074,1,1,'2117-05-08 14:18:19'),
	(49,101075,1,1,'2117-05-08 14:20:33'),
	(50,101077,1,1,'2117-05-08 14:37:17'),
	(51,101084,1,1,'2117-05-09 01:13:18'),
	(52,101099,1,1,'2117-05-09 07:05:59'),
	(53,101116,1,1,'2117-05-09 12:15:38'),
	(54,101113,1,1,'2117-05-09 13:30:52'),
	(55,101117,1,1,'2117-05-09 14:12:27'),
	(56,101118,1,1,'2117-05-09 14:23:57'),
	(57,101120,1,1,'2117-05-10 08:06:22'),
	(58,101121,1,1,'2117-05-10 15:23:38'),
	(59,101122,1,1,'2117-05-10 15:24:32'),
	(60,101123,1,1,'2117-05-10 15:37:58'),
	(61,101119,1,1,'2117-06-20 11:25:36'),
	(62,101148,1,1,'2117-07-26 10:18:43'),
	(63,101152,1,1,'2117-07-29 20:50:35'),
	(64,101151,1,1,'2117-08-03 13:04:28'),
	(65,101166,1,1,'2118-01-05 12:16:42'),
	(66,101171,1,1,'2118-04-27 22:24:22'),
	(67,101172,1,1,'2118-05-15 22:30:06'),
	(68,101173,1,1,'2118-08-22 20:30:54'),
	(69,101167,1,1,'2118-12-09 15:50:08'),
	(70,101165,1,1,'2119-03-09 06:52:26'),
	(71,101174,1,1,'2119-05-08 00:40:31'),
	(72,101175,1,1,'2119-06-06 01:49:36'),
	(73,101176,1,1,'2119-11-28 03:21:01'),
	(74,101177,1,1,'2120-03-30 18:23:32');

/*!40000 ALTER TABLE `user_package` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
