import Box from "@/components/Box";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import PageContentBlock from "@/components/PageContentBlock";
import ExecuteRequest from "@/modules/http/ExecuteRequest";
import { sendPostRequest } from "@/modules/http/http";
import { ProcessNotification, ToastError, ToastSuccess } from "@/modules/notifications/toasts";
import { SetupStep } from "@/modules/setup/FetchSetupStep";
import t from "@/modules/translation/t";
import Router from "next/router";
import { createRef, useState } from "react";

export default function SetupCoreSettings() {
    const [submitting, setSubmitting] = useState(false);

    const hostnameRef = createRef<HTMLInputElement>();
    const usernameRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();
    const portRef = createRef<HTMLInputElement>();
    const databaseRef = createRef<HTMLInputElement>();
    const steamApiKeyRef = createRef<HTMLInputElement>();

    const { response, finished, error } = ExecuteRequest<SetupStep | null>("/api/panelsetup/fetchstep", "get");
    if (finished == true && error.length == 0) {
        if (response == null) Router.push("/404");
        else if (response == "finished") Router.push("/");
        else if (response != "coresettings") Router.push(`/setup/${response}`);
    }
    if (error.length) console.log(error);

    return (
        <PageContentBlock title={t("setup.coresettings.title")} loading={!finished}>
            {error.length > 0 ? error : <>
                <div className="flex flex-col ml-auto mr-auto gap-4">
                    <Box style={{ minWidth: "420px" }}>
                        <Label>{t("setup.coresettings.hostname")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.hostname")} type={"text"} ref={hostnameRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                        <Label>{t("setup.coresettings.username")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.username")} type={"text"} ref={usernameRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                        <Label>{t("setup.coresettings.password")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.password")} type={"password"} ref={passwordRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                        <Label>{t("setup.coresettings.port")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.port")} type={"number"} min={1024} max={65535} defaultValue={3306} ref={portRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                        <Label>{t("setup.coresettings.database")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.database")} type={"text"} ref={databaseRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                        <Label>{t("setup.coresettings.steamapikey")}</Label>
                        <Input disabled={submitting} placeholder={t("setup.coresettings.steamapikey")} type={"password"} ref={steamApiKeyRef} style={{ maxWidth: "unset", width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }} />
                    </Box>
                    <Box className="flex flex-row gap-4">
                        <Button disabled={submitting} color={"secondary"} size={"small"} onClick={() => {
                            if (submitting) return;

                            if (!hostnameRef.current) return;
                            if (!usernameRef.current) return;
                            if (!passwordRef.current) return;
                            if (!portRef.current) return;
                            if (!databaseRef.current) return;
                            if (!steamApiKeyRef.current) return;

                            const hostname = hostnameRef.current.value;
                            const username = usernameRef.current.value;
                            const password = passwordRef.current.value;
                            const port = Number(portRef.current.value);
                            const database = databaseRef.current.value;
                            const steamApiKey = steamApiKeyRef.current.value;

                            if (!hostname.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.hostname" } }, ToastError);
                            if (!username.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.username" } }, ToastError);
                            if (!password.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.password" } }, ToastError);
                            if (port < 1024 || port > 65535) return ProcessNotification({ main: "errors.is_port", replace: { "{field}": "setup.coresettings.port" } }, ToastError);
                            if (!database.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.database" } }, ToastError);
                            if (!steamApiKey.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.steamapikey" } }, ToastError);

                            setSubmitting(true);

                            setTimeout(async () => {
                                try {
                                    await sendPostRequest("/api/panelsetup/testconnection", { hostname, username, password, port, database, steamApiKey }, (response) => {
                                        ProcessNotification(response.message, ToastSuccess);
                                        setSubmitting(false)
                                    }, (response) => {
                                        ProcessNotification(response.message, ToastError);
                                        setSubmitting(false)
                                    })
                                } catch (err) {
                                    console.error(err)
                                    ToastError(t("errors.system_error"));
                                    setSubmitting(false);
                                }
                            }, 500);
                        }}>{t("test_connection")}</Button>
                        <Button disabled={submitting} color={"green"} size={"small"} className="ml-auto" onClick={() => {
                            if (submitting) return;

                            if (!hostnameRef.current) return;
                            if (!usernameRef.current) return;
                            if (!passwordRef.current) return;
                            if (!portRef.current) return;
                            if (!databaseRef.current) return;
                            if (!steamApiKeyRef.current) return;

                            const hostname = hostnameRef.current.value;
                            const username = usernameRef.current.value;
                            const password = passwordRef.current.value;
                            const port = Number(portRef.current.value);
                            const database = databaseRef.current.value;
                            const steamApiKey = steamApiKeyRef.current.value;

                            if (!hostname.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.hostname" } }, ToastError);
                            if (!username.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.username" } }, ToastError);
                            if (!password.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.password" } }, ToastError);
                            if (port < 1024 || port > 65535) return ProcessNotification({ main: "errors.is_port", replace: { "{field}": "setup.coresettings.port" } }, ToastError);
                            if (!database.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.database" } }, ToastError);
                            if (!steamApiKey.length) return ProcessNotification({ main: "errors.no_empty", replace: { "{field}": "setup.coresettings.steamapikey" } }, ToastError);

                            setSubmitting(true);

                            setTimeout(async () => {
                                try {
                                    await sendPostRequest("/api/panelsetup/nextstep", { hostname, username, password, port, database, steamApiKey }, (response) => {
                                        if (response.message == "finished") Router.push("/");
                                        else Router.push(`/setup/${response.message}`)
                                    }, (response) => {
                                        ProcessNotification(response.message, ToastError);
                                        setSubmitting(false)
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
    );
}