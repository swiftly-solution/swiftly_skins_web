import { existsSync, readFileSync, writeFileSync } from "fs";
import { SetupStep } from "./FetchSetupStep";

export default (step: SetupStep) => {
    if (!existsSync("modules/setup/setup.json")) return;

    try {
        const jsonData = JSON.parse(readFileSync("modules/setup/setup.json").toString());
        jsonData.step = step;
        if (step == "finished") jsonData.finished = true
        writeFileSync("modules/setup/setup.json", JSON.stringify(jsonData));
    } catch (err) { console.log(err); }
}