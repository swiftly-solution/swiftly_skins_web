export default function (text: string, placeholder: { [key: string]: any }): string {
    for (const key of Object.keys(placeholder)) text = text.replace(new RegExp(key, "g"), placeholder[key]);
    return text
}