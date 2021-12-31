import { NS } from "/../NetscriptDefinitions.js"
import { scan } from "/lib/scan.js"
import { Flag, Argument, buildUsageString, buildNetscriptFlagsArray } from "/lib/usage.js"

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = []

const USAGE = buildUsageString("lsram", FLAGS, ARGS)

export async function main(ns: NS) {
    let flags: { _: string[], help: boolean } = { _: [], help: false }
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
    const AVAIL_SERVERS = SERVERS
        .map(srv => ns.getServer(srv))
        .filter(srv => srv.hasAdminRights && srv.maxRam > 0)
    
    const TOTAL_RAM    = AVAIL_SERVERS.map(srv => srv.maxRam).reduce((acc, cur) => acc + cur)
    const USED_RAM     = AVAIL_SERVERS.map(srv => srv.ramUsed).reduce((acc, cur) => acc + cur)
    const AVAIL_RAM    = TOTAL_RAM - USED_RAM
    const MAX_CONTIG   = AVAIL_SERVERS.map(srv => srv.maxRam).reduce((acc, cur) => Math.max(acc, cur))
    const AVAIL_CONTIG = AVAIL_SERVERS.map(srv => srv.maxRam - srv.ramUsed).reduce((acc, cur) => Math.max(acc, cur))

    ns.tprintf(`Total: ${TOTAL_RAM.toFixed(2)}GB (${MAX_CONTIG.toFixed(2)}GB Contiguous)`)
    ns.tprintf(`Used: ${USED_RAM.toFixed(2)}GB (${(USED_RAM / TOTAL_RAM * 100).toFixed(2)}%%)`)
    ns.tprintf(`Available: ${AVAIL_RAM.toFixed(2)}GB (${AVAIL_CONTIG.toFixed(2)}GB Contiguous)`)
}