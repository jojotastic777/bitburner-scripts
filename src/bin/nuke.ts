import { NS } from "/../NetscriptDefinitions.js";
import { nuke } from "/lib/nuke.js";
import { Argument, buildNetscriptFlagsArray, buildUsageString, Flag } from "/lib/usage.js";

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = [
    { name: "target", optional: false, array: true }
]

const USAGE = buildUsageString("nuke", FLAGS, ARGS)

export async function main(ns: NS) {
    let flags: { _: string[], help: boolean } = { _: [], help: false }
    try {
        flags = ns.flags(buildNetscriptFlagsArray(FLAGS))
    } catch (e) {
        ns.tprintf(USAGE)
        ns.exit()
    }

    if (flags.help || flags._.length === 0) {
        ns.tprintf(USAGE)
        ns.exit()
    }

    ns.tprintf(`Attempting to NUKE ${flags._.length} hosts.`)

    let nukeResults = flags._.map(srv => nuke(ns, srv))

    nukeResults.forEach(res => {
        if (res.status === "HOME") {
            ns.tprintf(`Failed to NUKE ${res.host}: Cannot NUKE home.`)
            return
        }

        if (res.status === "SERVER_MISSING") {
            ns.tprintf(`Failed to NUKE ${res.host}: Server Not Found.`)
            return
        }

        if (res.status === "INSUFFICIENT_PORT_BREAKERS") {
            ns.tprintf(`Failed to NUKE ${res.host}: Insufficient Port Breakers.`)
            return
        }

        if (res.status === "ALREADY_ROOT") {
            ns.tprintf(`Failed to NUKE ${res.host}: User Is Already Root.`)
            return
        }

        if (res.status === "OK") {
            ns.tprintf(`Successfully NUKED ${res.host}.`)
            return
        }
    })

    ns.tprintf("\n")
    ns.tprintf(`Successfully NUKED ${nukeResults.filter(res => res.status === "OK").length} out of ${nukeResults.length} hosts.`)
} 