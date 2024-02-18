import NotLoggedIn from "@/components/NotLoggedIn";
import PageContentBlock from "@/components/PageContentBlock";
import FetchGraffiti from "@/modules/graffiti/FetchGraffiti";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import t from "@/modules/translation/t";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Router from "next/router";
import { useState } from "react";

const SelectPage = dynamic(import("@/components/SelectPage"));

export default function Graffiti() {
    const session = useSession();
    const [d, setD] = useState(Date.now());

    const { response, finished, error } = ExecuteRequest<boolean>("/api/panelsetup/fetchfinished", "get");
    if (finished == true && response == false) Router.push("/setup");

    const userResponse = ExecuteRequest<string[]>("/api/user/fetchUserData", "post", { category: "graffiti", authenticated: session.status == 'authenticated' }, d);

    return (
        <PageContentBlock title={t("graffiti.title")} loading={session.status == 'loading' || finished == false || (finished == true && response == false)}>
            {/* {error.length > 0 ? error : (session.status == 'unauthenticated' ? <NotLoggedIn /> : <SelectPage updateCB={setD} data={FetchGraffiti()} userData={userResponse.response || []} />)} */}
            This page is not functional.
        </PageContentBlock>
    )
}