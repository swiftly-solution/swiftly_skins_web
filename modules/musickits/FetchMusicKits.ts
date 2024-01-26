import { MusicKit } from "../types/MusicKit";

var musickitsData: MusicKit[] = [];

export default (): MusicKit[] => {
    if (!musickitsData.length) {
        try {
            musickitsData = require("@/modules/musickits/musickits.json");
        } catch (err) { console.log(err) }
    }

    return musickitsData;
}