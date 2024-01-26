import FetchAgentInfo from "@/modules/agents/FetchAgentInfo";
import { GetConfigValue } from "@/modules/config/config";
import { fetchDB } from "@/modules/database/connection";
import FetchGraffitiInfo from "@/modules/graffiti/FetchGraffitiInfo";
import FetchMusicKitInfo from "@/modules/musickits/FetchMusicKitInfo";
import IsSetupFinished from "@/modules/setup/IsSetupFinished";
import FetchSkinInfo from "@/modules/skins/FetchSkinInfo";
import { Agent } from "@/modules/types/Agent";
import { Skin } from "@/modules/types/Skin";
import { User } from "@/modules/types/User";
import { ResultSetHeader } from "mysql2";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from 'zod';

const schema = z.object({
    id: z.string(),
    nameTag: z.string(),
    seed: z.number().min(1000).max(999999999),
    wear: z.number().min(0.0).max(1.0),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") return res.status(403).send("Unauthorized.");

    if (!schema.safeParse(req.body).success) return res.status(200).json({ status: 403, message: "errors.invalid_request" });
    const { id, nameTag, seed, wear }: { id: string, nameTag: string, seed: number, wear: number } = req.body;
    if (!nameTag.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "nametag" } } });

    if (!IsSetupFinished()) return res.status(403).send("Unauthorized.");

    const session = await getServerSession(req, res, { secret: GetConfigValue('nextauth_secret') });
    if (!session) return res.status(403).send("Unauthorized.");
    if (!session.user) return res.status(403).send("Unauthorized.");

    const steamid = String(session.user.email).split("@")[0];

    const users = await fetchDB<User[]>("select equippedSkins, skinsdata from sw_skins_users where steamid = ?", [steamid]);
    if (!users.length) return res.status(403).send("Unauthorized.");

    const user = users[0];
    if (typeof user.equippedSkins == 'string') user.equippedSkins = JSON.parse(user.equippedSkins);
    if (typeof user.skinsdata == 'string') user.skinsdata = JSON.parse(user.skinsdata);

    const newSkin = (id.includes("skin-") ? FetchSkinInfo : (id.includes("agent-") ? FetchAgentInfo : (id.includes("graffiti-") ? FetchGraffitiInfo : FetchMusicKitInfo)))(id);
    if (!newSkin) return res.status(403).send("Unauthorized.");

    if (!user.equippedSkins.includes(newSkin.id)) {
        for (const equippedSkin of user.equippedSkins) {
            const skin = (id.includes("skin-") ? FetchSkinInfo : (id.includes("agent-") ? FetchAgentInfo : (id.includes("graffiti-") ? FetchGraffitiInfo : FetchMusicKitInfo)))(equippedSkin);
            if (!skin) continue;
            if (id.includes("skin-")) {
                if ((skin as Skin).weapon == (newSkin as Skin).weapon) {
                    user.equippedSkins = user.equippedSkins.filter((val) => val != skin.id);
                    delete user.skinsdata[skin.id];
                }
            } else if (id.includes("agent-")) {
                if ((skin as Agent).team == (newSkin as Agent).team) {
                    user.equippedSkins = user.equippedSkins.filter((val) => val != skin.id);
                    delete user.skinsdata[skin.id];
                }
            } else {
                user.equippedSkins = user.equippedSkins.filter((val) => val != skin.id);
                delete user.skinsdata[skin.id];
            }
        }

        user.equippedSkins.push(newSkin.id);
        user.skinsdata[newSkin.id] = {
            wear, seed, nametag: nameTag
        };
    } else {
        user.equippedSkins = user.equippedSkins.filter((val) => val != newSkin.id);
        delete user.skinsdata[newSkin.id];
    }

    await fetchDB<ResultSetHeader>("update sw_skins_users set equippedSkins = ?, skinsdata = ? where steamid = ?", [JSON.stringify(user.equippedSkins), JSON.stringify(user.skinsdata), steamid]);

    return res.status(200).json({ status: 200, message: "updated" })
}