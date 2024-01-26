const { sign } = require("crypto");
const { readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } = require("fs");
const client = require("https");

const rawJson = JSON.parse(readFileSync("raw_skins.json"));
const raw2Json = JSON.parse(readFileSync("raw_skins2.json"));
const skins = [];

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
    rmSync("skins");
} catch(err) {}
mkdirSync("skins/images/skins", { recursive: true });

for(const skin of rawJson) {
    const image_name = skin.image.split("/")[skin.image.split("/").length - 1];

    skins.push({
        id: skin.id,
        name: skin.name,
        weapon: skin.weapon.id,
        rarity: skin.rarity.name,
        color: skin.rarity.color,
        paint_index: skin.paint_index,
        defindex: (raw2Json.filter((val) => val.weapon_name  == skin.weapon.id)[0] || { weapon_defindex: skin.weapon.id.includes("_gloves") ? "gloves" : "" }).weapon_defindex,
        team: skin.team.id == "both" ? "both" : (skin.team.id == "terrorists" ? "t" : "ct"),
        image: `/images/skins/${image_name}`
    })

    downloadImage(skin.image, `skins/images/skins/${image_name}`).then(console.log).catch(console.log);
}

writeFileSync("skins/skins.json", JSON.stringify(skins));