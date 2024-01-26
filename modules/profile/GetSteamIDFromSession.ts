import { Session } from "next-auth";

export default (session: Session) => {
    if (!session.user) return '-1';
    // @ts-expect-error
    return session.user.steam.steamid;
}