import { NS } from "/../NetscriptDefinitions.js";

function processData(data: { [filePath: string]: string }): { [filePath: string]: string } {
    let newData: { [filePath: string]: string } = {}

    Object.keys(data).forEach(key => newData[key.replaceAll("\\", "/").match(/\/dist\/.+$/)?.[0].slice(5) as string] = data[key])

    return newData
}

export async function main(ns: NS) {
    let updateServer = new WebSocket("ws://127.0.0.1:8080")

    updateServer.onmessage = async (event) => {
        let data = processData(JSON.parse(event.data))

        // Object.keys(data).map(async key => await ns.write(key, [data[key]], "w"))

        for (let key of Object.keys(data)) {
            let value = data[key]

            await ns.write(key, [value], "w")
        }

        updateServer.close()
    }

    await ns.asleep(1000)
}