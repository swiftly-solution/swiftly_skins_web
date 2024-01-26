import { Agent } from "../types/Agent";

var agentsData: Agent[] = [];

export default (): Agent[] => {
    if (!agentsData.length) {
        try {
            agentsData = require("@/modules/agents/agents.json");
        } catch (err) { console.log(err) }
    }

    return agentsData;
}