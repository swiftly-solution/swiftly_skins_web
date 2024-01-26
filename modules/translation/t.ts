import { get, has } from "nested-property"

var translationFile: Record<string, any> = {}

export default function (key: string) {
    if (!Object.keys(translationFile).length) translationFile = require(`@/modules/translation/translation.json`)

    return has(translationFile, key) ? get(translationFile, key) : key
}