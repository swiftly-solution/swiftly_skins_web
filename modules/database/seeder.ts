import { db } from "./connection";
import config, { GetConfigValue } from "../config/config";

const Seeder = async () => {
    db.config = { ...config, user: GetConfigValue('username'), host: GetConfigValue('hostname'), password: GetConfigValue('password'), database: GetConfigValue('database'), multipleStatements: true };


    await db.execute("DROP TABLE IF EXISTS `sw_skins_users`;");
    await db.execute("CREATE TABLE `sw_skins_users` (`steamid` varchar(256) NOT NULL, `admin` tinyint(1) NOT NULL DEFAULT 0, `equippedSkins` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT ('[]') CHECK (json_valid(`equippedSkins`))) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;")
    await db.execute("ALTER TABLE `sw_skins_users` ADD UNIQUE KEY `steamid` (`steamid`);");
    await db.execute("ALTER TABLE `sw_skins_users` ADD `skinsdata` JSON NOT NULL DEFAULT ('{}') AFTER `equippedSkins`;");
}

export { Seeder };
