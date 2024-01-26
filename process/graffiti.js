const { readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } = require("fs");
const client = require("https");

const rawJson = JSON.parse(readFileSync("raw_graffiti.json"));
const graffiti = [];

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
    rmSync("graffiti");
} catch(err) {}
mkdirSync("graffiti/images/graffiti", { recursive: true });

for(const graff of rawJson) {
    graffiti.push({
        id: graff.id,
        name: graff.name,
        rarity: graff.rarity.name,
        color: graff.rarity.color,
        image: `/images/graffiti/${graff.id}.png`
    })

    downloadImage(graff.image, `graffiti/images/graffiti/${graff.id}.png`).then(console.log).catch(console.log);
}

writeFileSync("graffiti/graffiti.json", JSON.stringify(graffiti));