import { NS } from "/../NetscriptDefinitions.js"
import { scan } from "/lib/scan.js"
import { Flag, Argument, buildUsageString, buildNetscriptFlagsArray } from "/lib/usage.js"

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = []

const USAGE = buildUsageString("killall", FLAGS, ARGS)

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
        .filter(srv => srv.hasAdminRights)
        .map(srv => srv.hostname)
    
    const PROCESSES = AVAIL_SERVERS
        .map(srv => ns.ps(srv).map(proc => ({ host: srv, ...proc })))
        .reduce((acc, cur) => acc.concat(cur))
        .filter(proc => proc.filename !== ns.getScriptName())
        .sort((a, b) => a.pid - b.pid)

    PROCESSES.forEach(({ pid, filename, host }) => {
        // @ts-ignore
        let killSuccess = ns.kill(pid)

        if (killSuccess) {
            ns.tprintf(`Killed ${filename}@${host} (PID ${pid}).`)
        }
    })
}