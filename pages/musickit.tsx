import NotLoggedIn from "@/components/NotLoggedIn";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import FetchMusicKits from "@/modules/musickits/FetchMusicKits";
import GetSteamIDFromSession from "@/modules/profile/GetSteamIDFromSession";
import t from "@/modules/translation/t";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Router from "next/router";

const SelectPage = dynamic(import("@/components/SelectPage"));

export default function MusicKit() {
    const session = useSession();
    const { response, finished, error } = ExecuteRequest<boolean>("/api/panelsetup/fetchfinished", "get");
    if (finished == true && response == false) Router.push("/setup");

    const userResponse = ExecuteRequest<string[]>("/api/user/fetchUserData", "post", { category: "music_kit", steamid: session.status == 'authenticated' ? GetSteamIDFromSession(session.data) : '-1' });

    return (
        <PageContentBlock title={t("musickits.title")} loading={session.status == 'loading' || finished == false || (finished == true && response == false)}>
            {error.length > 0 ? error : (session.status == 'unauthenticated' ? <NotLoggedIn /> : <SelectPage data={FetchMusicKits()} userData={userResponse.response || []} />)}
        </PageContentBlock>
    )
}