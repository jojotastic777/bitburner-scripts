import { NS } from "/../NetscriptDefinitions.js";
import { deploy, Deployment } from "/lib/deploy.js";
import { Flag, Argument, buildUsageString, buildNetscriptFlagsArray } from "/lib/usage.js";

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = [
    { name: "script",    optional: false, array: false },
    { name: "arguments", optional: true,  array: true }
]

const USAGE = buildUsageString("deploy", FLAGS, ARGS)

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

    let deployment: Deployment = {
        script: flags._[0],
        threads: 1,
        args: flags._.slice(1),
        dependencies: []
    }

    let deployStatus = await deploy(ns, deployment)

    if (deployStatus.status !== "OK") {
        ns.tprintf(`Deployment Failure: ${JSON.stringify(deployStatus)}`)
        ns.exit()
    }

    ns.tprintf(`Deployment Success: ${JSON.stringify(deployStatus)}`)
}