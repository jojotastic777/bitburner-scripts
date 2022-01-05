import { NS } from "/../NetscriptDefinitions.js";

const HACK_HOSTS_PATH  = "/etc/hackOrchSvc/hack_hosts.txt"
const HACK_TARGET_PATH = "/etc/hackOrchSvc/hack_target.txt"
const HACK_SCRIPT_PATH = "/bin/hack.js"
const SLEEP_LENGTH_MS  = 1000

export async function main(ns: NS) {
    while (true) {
        await ns.scp(HACK_HOSTS_PATH, "home", ns.getHostname())
        await ns.scp(HACK_TARGET_PATH, "home", ns.getHostname())
        let hackHosts  = (ns.read(HACK_HOSTS_PATH) as string).split("\n").filter(str => str !== "")
        let hackTarget = ns.read(HACK_TARGET_PATH) as string
        let missingHosts = hackHosts.filter(host => !ns.serverExists(host))
        if (missingHosts.length > 0) {
            ns.toast(`Hacking Orchestration Service couldn't find ${missingHosts.length} host${missingHosts.length > 1 ? "s" : ""}.`, "warning")
            await ns.sleep(SLEEP_LENGTH_MS)
            continue
        }

        if (!ns.serverExists(hackTarget)) {
            ns.toast(`Hacking Orchestration Service couldn't find hacking target: "${hackTarget}"`)
            await ns.sleep(SLEEP_LENGTH_MS)
            continue
        }

        if (!ns.fileExists(HACK_TARGET_PATH, "home")) {
            ns.toast(`Hacking Orchestration Script couldn't find hacking script @ "${HACK_SCRIPT_PATH}".`)
            await ns.sleep(SLEEP_LENGTH_MS)
            continue
        }

        let hackRam = ns.getScriptRam(HACK_SCRIPT_PATH, "home")

        for (let host of hackHosts) {
            let hostRamMax = ns.getServerMaxRam(host)
            let hostRamUsed = ns.getServerUsedRam(host)
            let hostRamAvail = hostRamMax - hostRamUsed
            let hostMaxHackThreads = Math.floor(hostRamAvail / hackRam)

            if (hostMaxHackThreads > 0 && !ns.scriptRunning(HACK_SCRIPT_PATH, host)) {
                await ns.scp(HACK_SCRIPT_PATH, "home", host)
                ns.exec(HACK_SCRIPT_PATH, host, hostMaxHackThreads, hackTarget)
            }
        }

        await ns.sleep(SLEEP_LENGTH_MS)
    }
}