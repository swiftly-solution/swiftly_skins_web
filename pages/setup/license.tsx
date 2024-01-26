import Box from "@/components/Box";
import Button from "@/components/Button";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import { sendPostRequest } from "@/modules/http/http";
import { ProcessNotification, ToastError, ToastSuccess } from "@/modules/notifications/toasts";
import { SetupStep } from "@/modules/setup/FetchSetupStep";
import t from "@/modules/translation/t";
import Router from "next/router";
import { useState } from "react";

export default function SetupLicense() {
    const [submitting, setSubmitting] = useState(false);

    const { response, finished, error } = ExecuteRequest<SetupStep | null>("/api/panelsetup/fetchstep", "get");
    if (finished == true && error.length == 0) {
        if (response == null) Router.push("/404");
        else if (response == "finished") Router.push("/");
        else if (response != "license") Router.push(`/setup/${response}`);
    }
    if (error.length) console.log(error);

    return (
        <PageContentBlock title={t("setup.license")} loading={!finished}>
            {error.length > 0 ? error : <>
                <div className="flex flex-col ml-auto mr-auto gap-4">
                    <Box>
                        MIT License<br /><br />

                        Copyright (c) 2023 Andrei Sebastian<br /><br />

                        Permission is hereby granted, free of charge, to any person obtaining a copy<br />
                        of this software and associated documentation files (the {"\""}Software{"\""}), to deal<br />
                        in the Software without restriction, including without limitation the rights<br />
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br />
                        copies of the Software, and to permit persons to whom the Software is<br />
                        furnished to do so, subject to the following conditions:<br /><br />

                        The above copyright notice and this permission notice shall be included in all<br />
                        copies or substantial portions of the Software.<br /><br />

                        THE SOFTWARE IS PROVIDED {"\""}AS IS{"\""}, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br />
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br />
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br />
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br />
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br />
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br />
                        SOFTWARE.
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
                        }}>{t("setup.license_accept")}</Button>
                    </Box>
                </div>
            </>}
        </PageContentBlock>
    )
}