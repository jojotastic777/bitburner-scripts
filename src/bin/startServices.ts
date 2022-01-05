import { NS } from "/../NetscriptDefinitions.js"
import { deploy } from "/lib/deploy.js"
import { Flag, Argument, buildUsageString, buildNetscriptFlagsArray } from "/lib/usage.js"

const FLAGS: Flag[] = [
    { name: "help", default: false, description: "Display this help page." }
]

const ARGS: Argument[] = []

const USAGE = buildUsageString("startup", FLAGS, ARGS)

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

    let updateSvcDeployment = await deploy(ns, {
        script: "/services/updateSvc.js",
        threads: 1,
        args: [],
        dependencies: []
    })

    ns.tprintf(`Update Service: ${JSON.stringify(updateSvcDeployment)}`)

    let nukeSvcDeployment = await deploy(ns, {
        script: "/services/nukeSvc.js",
        threads: 1,
        args: [],
        dependencies: [
            "/lib/nuke.js",
            "/lib/scan.js"
        ]
    })

    ns.tprintf(`Nuker Service: ${JSON.stringify(nukeSvcDeployment)}`)

    let hacknetSvcDeployment = await deploy(ns, {
        script: "/services/hacknetSvc.js",
        threads: 1,
        args: [],
        dependencies: []
    })

    ns.tprintf(`Hacknet Service: ${JSON.stringify(hacknetSvcDeployment)}`)

    let rackspaceSvcDeployment = await deploy(ns, {
        script: "/services/rackspaceSvc.js",
        threads: 1,
        args: [],
        dependencies: []
    })

    ns.tprintf(`Rackspace Service: ${JSON.stringify(rackspaceSvcDeployment)}`)

    let ramGuiSvcDeployment = await deploy(ns, {
        script: "/services/ramGuiSvc.js",
        threads: 1,
        args: [
            "/lib/gui.js",
            "/lib/scan.js"
        ],
        dependencies: []
    })

    ns.tprintf(`RAM Gui Service: ${JSON.stringify(ramGuiSvcDeployment)}`)

    let hackOrchSvcDeployment = await deploy(ns, {
        script: "/services/hackOrchSvc.js",
        threads: 1,
        args: [],
        dependencies: [
            "/lib/scan.js"
        ]
    })

    ns.tprintf(`Hacking Orchestration Service: ${JSON.stringify(hackOrchSvcDeployment)}`)
}