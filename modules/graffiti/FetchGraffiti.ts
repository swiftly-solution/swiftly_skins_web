import { Graffiti } from "../types/Graffiti";

var graffitiData: Graffiti[] = [];

export default (): Graffiti[] => {
    if (!graffitiData.length) {
        try {
            graffitiData = require("@/modules/graffiti/graffiti.json");
        } catch (err) { console.log(err) }
    }

    return graffitiData;
}