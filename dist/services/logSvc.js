import * as global from "/lib/global.js";
export async function main(ns) {
    if (global.data.logService === undefined) {
        global.data.logService = {
            messageQueue: []
        };
    }
    let messageQueue = global.data.logService.messageQueue;
    while (true) {
        for (let i = 0; i < messageQueue.length; i++) {
            let message = messageQueue[i];
            await ns.write(`/log/${message.programName}/${message.sessionStart}.txt`, [`[${message.logLevel.toUpperCase()}] [${(new Date(message.sessionStart).toLocaleString())}] [${message.programName}]: ${message.msg}`], "a");
        }
        await ns.sleep(100);
    }
}
