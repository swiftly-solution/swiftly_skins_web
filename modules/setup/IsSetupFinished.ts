import { readFileSync } from "fs";

export default (): boolean => {
    try {
        const setupData = JSON.parse(readFileSync("modules/setup/setup.json").toString())
        return setupData.finished;
    } catch (err) { console.log(err); return false; }
}