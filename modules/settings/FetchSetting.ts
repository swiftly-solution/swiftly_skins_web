import { get, has } from "nested-property";

var config: Record<string, any> = {};

export default function (key: string) {
    if (!config.lastUpdated) {
        config = require("@/modules/settings/settings.json");
        config.lastUpdated = (Date.now() + 60000);
    } else if (config.lastUpdated - Date.now() <= 0) {
        config = require("@/modules/settings/settings.json");
        config.lastUpdated = (Date.now() + 60000);
    };

    return has(config, key) ? get(config, key) : key;
}