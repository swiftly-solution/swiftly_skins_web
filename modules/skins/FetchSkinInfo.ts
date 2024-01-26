import { Skin } from "../types/Skin";
import FetchSkins from "./FetchSkins";

export default (query: string): Skin | undefined => {
    const skins = FetchSkins();

    const skin = skins.filter((value) => value.id == query);

    return (skin.length > 0 ? skin[0] : undefined);
}