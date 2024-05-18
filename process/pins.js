const { readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } = require("fs");
const client = require("https");

const rawJson = JSON.parse(readFileSync("process/raw_pins.json"));
const pins = [];

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
    rmSync("pins");
} catch(err) {}
mkdirSync("pins/images/pins", { recursive: true });

for(const pin of rawJson) {
    pins.push({
        id: pin.id,
        name: pin.name,
        rarity: pin.rarity.name,
        color: pin.rarity.color,
        image: `/images/pins/${pin.id}.png`
    })

    downloadImage(pin.image, `pins/images/pins/${pin.id}.png`).then(console.log).catch(console.log);
}

writeFileSync("pins/pins.json", JSON.stringify(pins));