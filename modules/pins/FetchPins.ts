import { Pins } from "../types/Pins";

var pinsData: Pins[] = [];

export default (): Pins[] => {
    if (!pinsData.length) {
        try {
            pinsData = require("@/modules/pins/pins.json");
        } catch (err) { console.log(err) }
    }

    return pinsData;
}