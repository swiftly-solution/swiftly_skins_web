import config, { SaveConfigKey } from "@/modules/config/config";
import IsDatabaseHostAccesible from "@/modules/database/IsDatabaseHostAccesible";
import { db } from "@/modules/database/connection";
import { Seeder } from "@/modules/database/seeder";
import FetchSetupStep, { SetupStep } from "@/modules/setup/FetchSetupStep";
import SetSetupStep from "@/modules/setup/SetSetupStep";
import { randomBytes } from "crypto";
import { writeFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';

const nextsteps: Record<SetupStep, SetupStep> = {
    license: "coresettings",
    coresettings: "seeding",
    seeding: "firstlogin",
    firstlogin: "finalsetup",
    finalsetup: "finished",
    finished: "finished"
};

const schema = z.object({
    hostname: z.string(),
    username: z.string(),
    password: z.string(),
    port: z.number().min(1024).max(65535),
    database: z.string(),
    steamApiKey: z.string()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") return res.status(403).send("Unauthorized.");

    const step = FetchSetupStep();
    if (step == null) return res.status(200).json({ status: 500, message: "errors.system_error" });

    if (step == "license") SetSetupStep("coresettings");
    else if (step == "coresettings") {
        if (!schema.safeParse(req.body).success) return res.status(200).json({ status: 403, message: "errors.invalid_request" });

        const { hostname, username, password, port, database, steamApiKey } = req.body;

        if (!hostname.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.hostname" } } });
        if (!username.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.username" } } });
        if (!password.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.password" } } });
        if (port < 1024 || port > 65535) return res.status(200).json({ status: 403, message: { main: "errors.is_port", replace: { "{field}": "setup.coresettings.port" } } });
        if (!database.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.database" } } });
        if (!steamApiKey.length) return res.status(200).json({ status: 403, message: { main: "errors.no_empty", replace: { "{field}": "setup.coresettings.steamapikey" } } });

        const [success, error] = await IsDatabaseHostAccesible(hostname, port, username, password, database);
        if (!success) return res.status(200).json({ status: 502, message: { main: "errors.encountered", replace: { "{error}": error } } });

        process.env.STEAM_SECRET = steamApiKey
        process.env.NEXTAUTH_SECRET = randomBytes(32).toString('base64')
        process.env.NEXTAUTH_URL = `${req.headers['x-forwarded-proto'] == "https" ? "https" : "http"}://${req.headers.host}/`;
        process.env.DB_HOSTNAME = hostname
        process.env.DB_USERNAME = username
        process.env.DB_PASSWORD = password
        process.env.DB_DATABASE = database
        process.env.DB_PORT = String(port)

        SaveConfigKey('hostname', process.env.DB_HOSTNAME)
        SaveConfigKey('username', process.env.DB_USERNAME)
        SaveConfigKey('password', process.env.DB_PASSWORD)
        SaveConfigKey('database', process.env.DB_DATABASE)
        SaveConfigKey('port', Number(process.env.DB_PORT))
        SaveConfigKey('steamapikey', process.env.STEAM_SECRET)
        SaveConfigKey('nextauth_secret', process.env.NEXTAUTH_SECRET)

        writeFileSync(".env", `STEAM_SECRET=${process.env.STEAM_SECRET}
NEXTAUTH_URL=${process.env.NEXTAUTH_URL}
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET}
DB_HOSTNAME=${process.env.DB_HOSTNAME}
DB_USERNAME=${process.env.DB_USERNAME}
DB_PASSWORD=${process.env.DB_PASSWORD}
DB_DATABASE=${process.env.DB_DATABASE}
DB_PORT=${process.env.DB_PORT}
        `);

        await Seeder();

        SetSetupStep("seeding");
    } else if (step == "seeding") SetSetupStep("firstlogin");
    else if (step == "finalsetup") SetSetupStep("finished");

    return res.status(200).json({ status: 200, message: nextsteps[step] });
}