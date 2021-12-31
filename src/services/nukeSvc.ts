import { NS } from "/../NetscriptDefinitions.js";
import { nuke } from "/lib/nuke.js";
import { scan } from "/lib/scan.js";

export async function main(ns: NS) {
    while (true) {
        const SERVERS = scan(ns)

        let nukeResults = SERVERS.map(srv => nuke(ns, srv)).filter(res => res.status === "OK")

        if (nukeResults.length > 0) {
            ns.toast(`NUKED ${nukeResults.length} host${nukeResults.length > 1 ? "s" : ""}.`)
        }

        await ns.sleep(1000)
    }
}