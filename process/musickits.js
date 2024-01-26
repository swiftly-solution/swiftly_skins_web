const { readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } = require("fs");
const client = require("https");

const rawJson = JSON.parse(readFileSync("raw_musickits.json"));
const musickits = [];

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
    rmSync("musickits");
} catch(err) {}
mkdirSync("musickits/images/musickits", { recursive: true });

for(const musickit of rawJson) {
    musickits.push({
        id: musickit.id,
        name: musickit.name,
        rarity: musickit.rarity.name,
        color: musickit.rarity.color,
        image: `/images/musickits/${musickit.id}.png`
    })

    downloadImage(musickit.image, `musickits/images/musickits/${musickit.id}.png`).then(console.log).catch(console.log);
}

writeFileSync("musickits/musickits.json", JSON.stringify(musickits));