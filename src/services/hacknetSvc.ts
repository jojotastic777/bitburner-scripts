import { NodeStats, NS } from "/../NetscriptDefinitions.js";

const HACKNET_DEFAULT_BUDGET_QUOTIENT = 1.0
const HACKNET_BUDGET_QUOTIENT_PATH = "/etc/hacknetSvc/budget_quotient.txt"

type ExtendedHacknetNode = NodeStats & {
    id: number
    levelCost: number
    ramCost: number
    coreCost: number
}

function getHacknetNodes(ns: NS) {
    let numNodes = ns.hacknet.numNodes()
    let nodes: ExtendedHacknetNode[] = []

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            id: i,
            levelCost: ns.hacknet.getLevelUpgradeCost(i, 1),
            ramCost: ns.hacknet.getRamUpgradeCost(i, 1),
            coreCost: ns.hacknet.getCoreUpgradeCost(i, 1),
            ...ns.hacknet.getNodeStats(i)
        })
    }

    return nodes
}

type HacknetPurchase = {
    type: "node" | "level" | "ram" | "core"
    cost: number
    buy: (ns: NS) => boolean
}

export async function main(ns: NS) {
    const MAX_NODES = ns.hacknet.maxNumNodes()

    while (true) {
        await ns.scp(HACKNET_BUDGET_QUOTIENT_PATH, "home", ns.getHostname())
        let budgetQuotient = parseFloat(ns.read(HACKNET_BUDGET_QUOTIENT_PATH))

        if (Number.isNaN(budgetQuotient)) {
            budgetQuotient = HACKNET_DEFAULT_BUDGET_QUOTIENT
        }

        const NODES = getHacknetNodes(ns)
        const MONEY_AVAIL = ns.getServerMoneyAvailable("home")

        let costs: HacknetPurchase[] = NODES.map(node => [
            { type: "level", cost: node.levelCost, buy: (ns: NS) => { ns.toast("Purchased Hacknet Level.", "info"); return ns.hacknet.upgradeLevel(node.id, 1) } },
            { type: "ram",   cost: node.ramCost,   buy: (ns: NS) => { ns.toast("Purchased Hacknet RAM.", "info"); return ns.hacknet.upgradeRam(node.id, 1)     } },
            { type: "core",  cost: node.coreCost,  buy: (ns: NS) => { ns.toast("Purchased Hacknet Level."), "info"; return ns.hacknet.upgradeCore(node.id, 1)  } }
        ] as HacknetPurchase[]).reduce((acc, cur) => acc.concat(cur), [])

        if (ns.hacknet.numNodes() < MAX_NODES) {
            costs.push({ type: "node", cost: ns.hacknet.getPurchaseNodeCost(), buy: (ns: NS) => { ns.toast("Purchased Hacknet Node.", "info"); return ns.hacknet.purchaseNode() !== -1 } })
        }

        costs
            .filter(c => c.cost <= MONEY_AVAIL * budgetQuotient)
            .sort((a, b) => a.cost - b.cost)[0]
            ?.buy(ns)

        await ns.sleep(1000)
    }
}