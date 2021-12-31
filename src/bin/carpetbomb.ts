import { NS } from "/../NetscriptDefinitions.js"
import { nuke } from "/lib/nuke.js"
import { scan } from "/lib/scan.js"
import { Argument, buildNetscriptFlagsArray, buildUsageString, Flag } from "/lib/usage.js"

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = []

const USAGE = buildUsageString("carpetbomb", FLAGS, ARGS)

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

    const SERVERS = scan(ns)

    let nukeResults = SERVERS.map(srv => nuke(ns, srv))

    nukeResults.filter(res => res.status === "OK").forEach(res => {
        ns.tprintf(`Successfully NUKED ${res.host}.`)
    })

    ns.tprintf("\n")
    ns.tprintf(`Successfully NUKED ${nukeResults.filter(res => res.status === "OK").length} out of ${nukeResults.length} hosts.`)
}