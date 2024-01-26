export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_HOSTNAME: string;
            DB_DATABASE: string;
            DB_PORT: string;
            STEAM_SECRET: string;
        };
    }
}