import { db } from "./connection";
import config, { GetConfigValue } from "../config/config";

const Seeder = async () => {
    db.config = { ...config, user: GetConfigValue('username'), host: GetConfigValue('hostname'), password: GetConfigValue('password'), database: GetConfigValue('database'), multipleStatements: true };
    

    await db.execute("DROP TABLE IF EXISTS `sw_skins_settings`;");
    await db.execute("DROP TABLE IF EXISTS `sw_skins_users`;");
    await db.execute("CREATE TABLE `sw_skins_settings` (`key` varchar(512) NOT NULL, `value` text NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;")
    await db.execute("INSERT INTO `sw_skins_settings` (`key`, `value`) VALUES ('title', 'Skins Plugin - Swiftly');")
    await db.execute("CREATE TABLE `sw_skins_users` (`steamid` varchar(256) NOT NULL, `admin` tinyint(1) NOT NULL DEFAULT 0, `unlockedSkins` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`unlockedSkins`)), `equippedSkins` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`equippedSkins`))) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;")
    await db.execute("ALTER TABLE `sw_skins_settings` ADD UNIQUE KEY `key` (`key`);");
    await db.execute("ALTER TABLE `sw_skins_users` ADD UNIQUE KEY `steamid` (`steamid`);");
}

export { Seeder };