import IsSetupFinished from "@/modules/setup/IsSetupFinished";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "GET") return res.status(403).send("Unauthorized.");

    return res.status(200).json({ value: IsSetupFinished() });
}