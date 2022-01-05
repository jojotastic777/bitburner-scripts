import { NS } from "/../NetscriptDefinitions.js";

export async function main(ns: NS) {
    let target = ns.args[0] as string
    ns.hack(target)
}