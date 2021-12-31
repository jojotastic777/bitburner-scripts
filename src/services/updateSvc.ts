import { NS } from "/../NetscriptDefinitions.js";

type FileCreation = {
    eventType: "creation"
    name: string
    contents: string
}

type FileUpdate = {
    eventType: "update"
    name: string
    contents: string
}

type FileDeletion = {
    eventType: "deletion"
    name: string
}

type FileEvent = FileCreation | FileUpdate | FileDeletion

let messagesQueue: FileEvent[] = []

export async function main(ns: NS) {
    let updateServer = new WebSocket("ws://127.0.0.1:8080")

    updateServer.onerror = () => {
        ns.toast("Update server connection error.", "error")
    }

    updateServer.onmessage = async event => {
        let fileEvent: FileEvent = JSON.parse(event.data)

        messagesQueue.push(fileEvent)

        if (fileEvent.eventType === "creation" || fileEvent.eventType === "update") {
            await ns.write(fileEvent.name, [fileEvent.contents], "w")
        }

        if (fileEvent.eventType === "update") {
            if (fileEvent.name === ns.getScriptName()) {
                ns.toast("Updater updated. Restarting.", "warning")
                ns.spawn(ns.getScriptName())
            }
        }

        if (fileEvent.eventType === "deletion") {
            ns.rm(fileEvent.name)
        }
    }

    updateServer.onclose = () => {
        ns.toast("Disconnected from update server.", "warning")
        ns.exit()
    }

    ns.atExit(() => updateServer.close())

    while (true) {
        let createdCount = messagesQueue.filter(msg => msg.eventType === "creation").length
        let updatedCount = messagesQueue.filter(msg => msg.eventType === "update").length
        let deletedCount = messagesQueue.filter(msg => msg.eventType === "deletion").length

        if (createdCount > 0) {
            ns.toast(`Created ${createdCount} ${createdCount > 1 ? "files" : "file"}.`)
        }

        if (updatedCount > 0) {
            ns.toast(`Updated ${updatedCount} ${updatedCount > 1 ? "files" : "file"}.`)
        }

        if (deletedCount > 0) {
            ns.toast(`Deleted ${deletedCount} ${deletedCount > 1 ? "files" : "file"}.`)
        }

        messagesQueue = []

        await ns.asleep(1000)
    }
}