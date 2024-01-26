import config, { GetConfigValue } from "@/modules/config/config";
import { db } from "@/modules/database/connection";
import FetchSetupStep from "@/modules/setup/FetchSetupStep";
import SetSetupStep from "@/modules/setup/SetSetupStep";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import SteamProvider, { PROVIDER_ID } from 'next-auth-steam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return NextAuth(req, res, {
        secret: GetConfigValue('nextauth_secret'),
        providers: [
            SteamProvider(req, {
                clientSecret: GetConfigValue('steamapikey'),
                callbackUrl: `${req.headers['x-forwarded-proto'] == "https" ? "https" : "http"}://${req.headers.host}/api/auth/callback`
            })
        ],
        callbacks: {
            jwt({ token, account, profile }) {
                if (account?.provider == PROVIDER_ID) token.steam = profile;
                return token;
            },
            signIn({ user, account, profile, email, credentials }) {
                // @ts-expect-error
                db.execute("insert ignore into sw_skins_users (steamid, admin, unlockedSkins, equippedSkins) values (?, ?, ?, ?)", [profile.steamid, FetchSetupStep() == "firstlogin", "[]", "[]"])
                if (FetchSetupStep() == "firstlogin") SetSetupStep("finalsetup")
                return true;
            },
            session({ session, token }) {
                // @ts-expect-error
                if ('steam' in token && session.user) session.user.steam = token.steam;
                return session;
            }
        }
    });
}