import { Skin } from "../types/Skin";

var skinsData: Skin[] = [];

export default (): Skin[] => {
    if (!skinsData.length) {
        try {
            skinsData = require("@/modules/skins/skins.json");
        } catch (err) { console.log(err) }
    }

    return skinsData;
}