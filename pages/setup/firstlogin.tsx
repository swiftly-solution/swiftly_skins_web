import Box from "@/components/Box";
import Button from "@/components/Button";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import { SetupStep } from "@/modules/setup/FetchSetupStep";
import t from "@/modules/translation/t";
import { signIn } from "next-auth/react";
import Router from "next/router";

export default function SetupFirstLogin() {
    const { response, finished, error } = ExecuteRequest<SetupStep | null>("/api/panelsetup/fetchstep", "get");
    if (finished == true && error.length == 0) {
        if (response == null) Router.push("/404");
        else if (response == "finished") Router.push("/");
        else if (response != "firstlogin") Router.push(`/setup/${response}`);
    }
    if (error.length) console.log(error);

    return (
        <PageContentBlock title={t("setup.firstlogin.title")} loading={!finished}>
            {error.length > 0 ? error : <>
                <div className="flex flex-col ml-auto mr-auto gap-4">
                    <Box>
                        {t("setup.firstlogin.message")}
                    </Box>
                    <Box>
                        <Button size={"large"} color={"green"} onClick={() => signIn("steam")}>{t("login")}</Button>
                    </Box>
                </div>
            </>}
        </PageContentBlock>
    )
}