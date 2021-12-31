import { NS } from "/../NetscriptDefinitions.js";
import { scan } from "/lib/scan.js";
import { buildNetscriptFlagsArray, buildUsageString, Flag } from "/lib/usage.js";

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const USAGE: string = buildUsageString("scan", FLAGS, [])

export async function main(ns: NS) {
    let flags: { help: boolean } = { help: false }
    try {
        flags = ns.flags(buildNetscriptFlagsArray(FLAGS))
    } catch (e) {
        ns.tprintf(USAGE)
        ns.exit()
    }

    if (flags.help) {
        ns.tprintf(USAGE)
        ns.exit()
    }

    const SERVERS = scan(ns).map(srv => ns.getServer(srv))

    const LONGEST_HOSTNAME = SERVERS.map(srv => srv.hostname.length).reduce((acc, cur) => Math.max(acc, cur))
    const LONGEST_IP       = SERVERS.map(srv => srv.ip.length).reduce((acc, cur) => Math.max(acc, cur))

    let LABEL = `${"Hostname".padEnd(LONGEST_HOSTNAME)} ${"IP".padEnd(LONGEST_IP)} Root Access`
    ns.tprintf(LABEL)

    for (let server of SERVERS) {
        ns.tprintf(`${server.hostname.padEnd(LONGEST_HOSTNAME)} ${server.ip.padEnd(LONGEST_IP)} ${server.hasAdminRights ? "Y" : "N"}`)
    }

    ns.tprintf(`\n`)
    ns.tprintf(`Total Servers:               ${SERVERS.length}`)
    ns.tprintf(`Servers With Root Access:    ${SERVERS.filter(srv => srv.hasAdminRights).length}/${SERVERS.length}`)
    ns.tprintf(`Servers Without Root Access: ${SERVERS.filter(srv => !srv.hasAdminRights).length}/${SERVERS.length}`)
}