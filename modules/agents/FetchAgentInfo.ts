import { Agent } from "../types/Agent";
import FetchAgents from "./FetchAgents";

export default (query: string): Agent | undefined => {
    const agents = FetchAgents();

    const agent = agents.filter((val) => val.id == query);

    return (agent.length > 0 ? agent[0] : undefined);
}