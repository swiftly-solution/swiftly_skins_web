export interface User {
    steamid: string;
    admin: boolean;
    equippedSkins: string[];
    skinsdata: Record<string, {
        nametag: string;
        seed: number;
        wear: number;
    }>
}