import { fetchDB } from "@/modules/database/connection";
import IsSetupFinished from "@/modules/setup/IsSetupFinished";
import { User } from "@/modules/types/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != "POST") return res.status(403).send("Unauthorized.");
    if(!IsSetupFinished()) return res.status(403).send("Unauthorized.");
    if(req.body.steamid == '-1') return res.status(200).json({ value: [] });

    const users = await fetchDB<User[]>("select * from sw_skins_users where steamid = ?", [req.body.steamid]);
    if(!users.length) return res.status(403).send("Unauthorized.");
    if(typeof users[0].equippedSkins == 'string') users[0].equippedSkins = JSON.parse(users[0].equippedSkins);

    return res.status(200).json({ value: users[0].equippedSkins.filter((val) => val.startsWith(`${req.body.category}-`)) });
}