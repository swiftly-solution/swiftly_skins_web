var config: Record<string, any> = {
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT.length > 0 ? Number(process.env.DB_PORT) : 3306,
    steamapikey: process.env.STEAM_SECRET.length < 32 ? "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" : process.env.STEAM_SECRET,
    nextauth_secret: process.env.NEXTAUTH_SECRET?.length == 0 ? "YndRKaq+PyHEDVepWkR/O2hvPZluIof27W/01tkQICc=" : process.env.NEXTAUTH_SECRET
}

export function SaveConfigKey(key: string, value: any) {
    config[key] = value;
}

export function GetConfigValue(key: string): any {
    return config[key];
}

export default config;