import { readFileSync } from "fs";

export type SetupStep = "license" | "coresettings" | "seeding" | "firstlogin" | "finalsetup" | "finished";

export default (): SetupStep | null => {
    try {
        const setupData = JSON.parse(readFileSync("modules/setup/setup.json").toString());
        if (setupData.finished) return "finished";
        else return setupData.step;
    } catch (err) { console.log(err); return null; }
}