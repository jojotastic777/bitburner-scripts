import { NS } from "/../NetscriptDefinitions.js";

const DEFAULT_BUDGET_QUOTIENT    = 1.0
const BUDGET_QUOTIENT_PATH       = "/etc/rackspaceSvc/budget_quotient.txt"
const DEFAULT_SERVER_RAM         = 128
const SERVER_RAM_PATH            = "/etc/rackspaceSvc/server_ram.txt"
const DEFAULT_SERVER_NAME_PREFIX = "starforge-"
const SERVER_NAME_PREFIX_PATH    = "/etc/rackspaceSvc/server_name_prefix.txt"
const SLEEP_LENGTH_MS            = 1000

export async function main(ns: NS) {
    while (true) {
        // Get budget quotient.
        await ns.scp(BUDGET_QUOTIENT_PATH, "home", ns.getHostname())
        let budgetQuotient = parseFloat(ns.read(BUDGET_QUOTIENT_PATH))

        if (Number.isNaN(budgetQuotient)) {
            budgetQuotient = DEFAULT_BUDGET_QUOTIENT
        }

        // Get desired server ram.
        await ns.scp(SERVER_RAM_PATH, "home", ns.getHostname())
        let serverRam = parseFloat(ns.read(SERVER_RAM_PATH))

        if (Number.isNaN(serverRam)) {
            serverRam = DEFAULT_SERVER_RAM
        }

        // Get desired server prefix.
        await ns.scp(SERVER_NAME_PREFIX_PATH, "home", ns.getHostname())
        let serverNamePrefix = ns.read(SERVER_NAME_PREFIX_PATH)

        if (serverNamePrefix === "" ) {
            serverNamePrefix = DEFAULT_SERVER_NAME_PREFIX
        }

        const MONEY_AVAIL = ns.getServerMoneyAvailable("home")
        const MAX_SERVERS = ns.getPurchasedServerLimit()
        const CURR_SERVERS = ns.getPurchasedServers()
        const SERVER_COST = ns.getPurchasedServerCost(serverRam)

        if (CURR_SERVERS.length === MAX_SERVERS) {
            ns.print("Reached max servers.")
            await ns.sleep(SLEEP_LENGTH_MS)
            continue
        }

        if (MONEY_AVAIL * budgetQuotient < SERVER_COST) {
            ns.print(`A ${serverRam}GB server would cost ${SERVER_COST}, only ${MONEY_AVAIL * budgetQuotient} is available.`)
            await ns.sleep(SLEEP_LENGTH_MS)
            continue
        }

        let hostname = ns.purchaseServer(serverNamePrefix + CURR_SERVERS.length.toString(), serverRam)
        ns.toast(`Purchased ${serverRam}GB server: "${hostname}".`, "info")

        await ns.sleep(SLEEP_LENGTH_MS)
    }
}