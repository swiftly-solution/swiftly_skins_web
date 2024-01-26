import { useEffect, useState } from "react"
import http from "./http";

export default <T>(url: string, method: "get" | "post", body?: any): { response: T | null, finished: boolean, error: string } => {
    const [resp, setResp] = useState<{ response: T | null, finished: boolean, error: string }>({ response: null, finished: false, error: "" });

    useEffect(() => {
        if(resp.finished) return;
        if (method == "get") http.get(`${url}?t=${Date.now()}`).then((value) => setResp({ response: value.data.value, finished: true, error: "" })).catch((err) => setResp({ response: null, finished: true, error: err }));
        else if (method == "post") http.post(`${url}`, body).then((value) => setResp({ response: value.data.value, finished: true, error: "" })).catch((err) => setResp({ response: null, finished: true, error: err }));
    }, [url, method, body]);

    return resp;
}