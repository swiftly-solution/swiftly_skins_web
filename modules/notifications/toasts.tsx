import { toast } from "react-hot-toast";
import ReplacePlaceholders from "../translation/ReplacePlaceholders";
import t from "../translation/t";
import dynamic from "next/dynamic";

const SuccessIcon = dynamic(import("@/modules/notifications/icons/SuccessIcon"));
const ErrorIcon = dynamic(import("@/modules/notifications/icons/ErrorIcon"));

export function ToastError(text: string) {
    const toastID = toast.error(text, {
        icon: <SuccessIcon />,
        style: {
            background: "rgba(162, 0, 0, 0.4)",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "24px",
            fontFamily: "poppins"
        }
    })
    setTimeout(() => toast.remove(toastID), 3000);
}

export function ToastSuccess(text: string) {
    const toastID = toast.success(text, {
        icon: <ErrorIcon />,
        style: {
            background: "rgba(0, 140, 22, 0.4)",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "24px",
            fontFamily: "poppins"
        }
    })
    setTimeout(() => toast.remove(toastID), 3000);
}

export function ProcessNotification(message: string | Record<string, any>, cb: (text: string) => void) {
    if (typeof message != "string") {
        var placeholders: { [key: string]: string } = {}
        for (const key of Object.keys(message.replace)) placeholders[key] = t(message.replace[key])
        cb(ReplacePlaceholders(t(message.main), placeholders));
    } else cb(t(message));
}