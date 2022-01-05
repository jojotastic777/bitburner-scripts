import { NS } from "/../NetscriptDefinitions.js";

export async function main(ns: NS) {
    let target       = ns.args[0] as string

    let currSecLevel = ns.getServerSecurityLevel(target)
    let minSecLevel  = ns.getServerMinSecurityLevel(target)
    
    let currMoney    = ns.getServerMoneyAvailable(target)
    let maxMoney     = ns.getServerMaxMoney(target)

    if (currSecLevel > minSecLevel) {
        await ns.weaken(target)
    } else if (currMoney < maxMoney) {
        await ns.grow(target)
    } else {
        await ns.hack(target)
    }
}