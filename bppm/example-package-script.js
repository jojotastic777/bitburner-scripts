let messagesQueue = [];
export async function main(ns) {
    let updateServer = new WebSocket("ws://127.0.0.1:8080");
    updateServer.onerror = () => {
        ns.toast("Update server connection error.", "error");
    };
    updateServer.onmessage = async (event) => {
        let fileEvent = JSON.parse(event.data);
        messagesQueue.push(fileEvent);
        if (fileEvent.eventType === "creation" || fileEvent.eventType === "update") {
            await ns.write(fileEvent.name, [fileEvent.contents], "w");
            if (ns.getHostname() !== "home") {
                await ns.scp(fileEvent.name, ns.getHostname(), "home");
            }
        }
        if (fileEvent.eventType === "update") {
            if (fileEvent.name === ns.getScriptName()) {
                ns.toast("Updater updated. Restarting.", "warning");
                ns.spawn(ns.getScriptName());
            }
        }
        if (fileEvent.eventType === "deletion") {
            ns.rm(fileEvent.name);
            if (ns.getHostname() !== "home") {
                ns.rm(fileEvent.name, "home");
            }
        }
    };
    updateServer.onclose = () => {
        ns.toast("Disconnected from update server.", "warning");
        ns.exit();
    };
    ns.atExit(() => updateServer.close());
    while (true) {
        let createdCount = messagesQueue.filter(msg => msg.eventType === "creation").length;
        let updatedCount = messagesQueue.filter(msg => msg.eventType === "update").length;
        let deletedCount = messagesQueue.filter(msg => msg.eventType === "deletion").length;
        if (createdCount > 0) {
            ns.toast(`Created ${createdCount} ${createdCount > 1 ? "files" : "file"}.`);
        }
        if (updatedCount > 0) {
            ns.toast(`Updated ${updatedCount} ${updatedCount > 1 ? "files" : "file"}.`);
        }
        if (deletedCount > 0) {
            ns.toast(`Deleted ${deletedCount} ${deletedCount > 1 ? "files" : "file"}.`);
        }
        messagesQueue = [];
        await ns.asleep(1000);
    }
}
