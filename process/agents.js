const { readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } = require("fs");
const client = require("https");

const rawJson = JSON.parse(readFileSync("raw_agents.json"));
const agents = [];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

try {
    rmSync("agents");
} catch(err) {}
mkdirSync("agents/images/agents", { recursive: true });

for(const agent of rawJson) {
    agents.push({
        id: agent.id,
        name: agent.name,
        rarity: agent.rarity.name,
        color: agent.rarity.color,
        team: agent.team.id == "terrorists" ? "t" : "ct",
        image: `/images/agents/${agent.id}.png`
    })

    downloadImage(agent.image, `agents/images/agents/${agent.id}.png`).then(console.log).catch(console.log);
}

writeFileSync("agents/agents.json", JSON.stringify(agents));