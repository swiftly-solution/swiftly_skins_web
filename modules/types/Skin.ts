export interface Skin {
    id: string;
    name: string;
    weapon: string;
    rarity: string;
    color: string;
    paint_index: string;
    defindex: string;
    team: "both" | "t" | "ct";
    image: string;
}