import Box from "@/components/Box";
import Button from "@/components/Button";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import { sendPostRequest } from "@/modules/http/http";
import { ProcessNotification, ToastError } from "@/modules/notifications/toasts";
import { SetupStep } from "@/modules/setup/FetchSetupStep";
import t from "@/modules/translation/t";
import Router from "next/router";
import { useState } from "react";

export default function SetupSeeding() {
    const [submitting, setSubmitting] = useState(false);

    const { response, finished, error } = ExecuteRequest<SetupStep | null>("/api/panelsetup/fetchstep", "get");
    if (finished == true && error.length == 0) {
        if (response == null) Router.push("/404");
        else if (response == "finished") Router.push("/");
        else if (response != "seeding") Router.push(`/setup/${response}`);
    }
    if (error.length) console.log(error);

    return (
        <PageContentBlock title={t("setup.seeding.title")} loading={!finished}>
            {error.length > 0 ? error : <>
                <div className="flex flex-col ml-auto mr-auto gap-4">
                    <Box>
                        {t("setup.seeding.message")}
                    </Box>
                    <Box>
                        <Button size={"large"} color={"green"} disabled={submitting} onClick={() => {
                            if (submitting) return;

                            setSubmitting(true);

                            setTimeout(async () => {
                                try {
                                    await sendPostRequest("/api/panelsetup/nextstep", {}, (response) => {
                                        if (response.message == "finished") Router.push("/");
                                        else Router.push(`/setup/${response.message}`)
                                    }, (response) => {
                                        ProcessNotification(response.message, ToastError);
                                        setSubmitting(false);
                                    })
                                } catch (err) {
                                    console.error(err)
                                    ToastError(t("errors.system_error"));
                                    setSubmitting(false);
                                }
                            }, 500);
                        }}>{t("continue")}</Button>
                    </Box>
                </div>
            </>}
        </PageContentBlock>
    )
}