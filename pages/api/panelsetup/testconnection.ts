import IsDatabaseHostAccesible from "@/modules/database/IsDatabaseHostAccesible";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") return res.status(403).send("Unauthorized.");

    const { hostname, username, password, port, database, steamApiKey } = req.body;

    if (!hostname.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.hostname" } } });
    if (!username.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.username" } } });
    if (!password.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.password" } } });
    if (port < 1024 || port > 65535) return res.status(200).json({ status: 403, message: { main: "errors.is_port", replace: { "{field}": "setup.coresettings.port" } } });
    if (!database.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.database" } } });
    if (!steamApiKey.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.steamapikey" } } });

    const [success, error] = await IsDatabaseHostAccesible(hostname, port, username, password, database);
    if (!success) return res.status(200).json({ status: 502, message: { main: "errors.encountered", replace: { "{error}": error } } });

    return res.status(200).json({ status: 200, message: "setup.coresettings.success" });
}