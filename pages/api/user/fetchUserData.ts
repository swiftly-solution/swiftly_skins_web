import { GetConfigValue } from "@/modules/config/config";
import { fetchDB } from "@/modules/database/connection";
import IsSetupFinished from "@/modules/setup/IsSetupFinished";
import { User } from "@/modules/types/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") return res.status(403).send("Unauthorized.");
    if (!IsSetupFinished()) return res.status(403).send("Unauthorized.");
    if (!req.body.authenticated) return res.status(200).json({ value: [] });

    const session = await getServerSession(req, res, { secret: GetConfigValue('nextauth_secret') });
    if (!session) return res.status(200).json({ value: [] });
    if (!session.user) return res.status(200).json({ value: [] });

    const steamid = String(session.user.email).split("@")[0];

    const users = await fetchDB<User[]>("select equippedSkins from sw_skins_users where steamid = ?", [steamid]);
    if (!users.length) return res.status(403).send("Unauthorized.");
    if (typeof users[0].equippedSkins == 'string') users[0].equippedSkins = JSON.parse(users[0].equippedSkins);

    return res.status(200).json({ value: users[0].equippedSkins.filter((val) => val.startsWith(`${String(req.body.category)}-`)) });
}