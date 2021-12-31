import { scan } from "/lib/scan.js";
import { NS } from "/../NetscriptDefinitions.js";

type SyncFileFailure = "NO_FILE" | "NO_SOURCE_HOST" | "NO_DESTINATION_HOST" | "UNKNOWN_FILE_SYNC_ERROR"
type SyncFileSuccess = "OK"
type SyncFileStatus  = { status: SyncFileFailure | SyncFileSuccess, file: string, sourceHost: string, destinationHost: string }

export async function syncFile(ns: NS, file: string, sourceHost: string, destinationHost: string): Promise<SyncFileStatus> {
    if (!ns.fileExists(file, "home")) {
        return { status: "NO_FILE", file, sourceHost, destinationHost }
    }

    if (!ns.serverExists(sourceHost)) {
        return { status: "NO_SOURCE_HOST", file, sourceHost, destinationHost }
    }

    if (!ns.serverExists(destinationHost)) {
        return { status: "NO_DESTINATION_HOST", file, sourceHost, destinationHost }
    }

    let scpStatus = await ns.scp(file, sourceHost, destinationHost)

    return { status: scpStatus ? "OK" : "UNKNOWN_FILE_SYNC_ERROR", file, sourceHost, destinationHost }
}

type ScriptArg = string | number | boolean

type ExecFailure = "NO_HOST" | "NOT_ROOT" | "ALREADY_RUNNING" | "INVALID_THREADS" | "UNKNOWN_EXEC_ERROR" | SyncFileFailure
type ExecSuccess = "OK"
type ExecStatus  = { status: ExecFailure | ExecSuccess, script: string, host: string, threads: number, args: ScriptArg[] }

export async function exec(ns: NS, script: string, host: string, threads: number, args: ScriptArg[]): Promise<ExecStatus> {
    if (!ns.serverExists(host)) {
        return { status: "NO_HOST", script, host, threads, args }
    }

    if (!ns.hasRootAccess(host)) {
        return { status: "NOT_ROOT", script, host, threads, args }
    }

    if (ns.scriptRunning(script, host)) {
        return { status: "ALREADY_RUNNING", script, host, threads, args }
    }

    if (threads < 1) {
        return { status: "INVALID_THREADS", script, host, threads, args }
    }

    let syncStatus = await syncFile(ns, script, "home", host)

    if (syncStatus.status !== "OK") {
        return { status: syncStatus.status, script, host, threads, args }
    }

    let execStatus = ns.exec(script, host, threads, ...args)

    return { status: execStatus > 0 ? "OK" : "UNKNOWN_EXEC_ERROR", script, host, threads, args }
}

export type Deployment = {
    script: string
    threads: number
    args: ScriptArg[]

    dependencies: string[]
}

type DeployFailure       = "NO_USABLE_HOST" | ExecFailure
type DeploySuccess       = "OK"
type DeployStatusSuccess = { status: DeploySuccess, host: string, deployment: Deployment }
type DeployStatusFailure = { status: DeployFailure, host?: string, deployment: Deployment }
type DeployStatus        = DeployStatusFailure | DeployStatusSuccess

export async function deploy(ns: NS, deployment: Deployment): Promise<DeployStatus> {
    let { script, threads, args, dependencies } = deployment

    const SERVERS = scan(ns)
    const AVAIL_SERVERS = SERVERS
        .map(srv => ns.getServer(srv))
        .filter(srv => srv.hasAdminRights && ns.getScriptRam(script) <= srv.maxRam - srv.ramUsed && !ns.scriptRunning(script, srv.hostname) && srv.hostname !== "home")
        .sort((a, b) => a.maxRam - b.maxRam)
    
    if (AVAIL_SERVERS.length === 0) {
        return { status: "NO_USABLE_HOST", deployment }
    }

    let bestHost = AVAIL_SERVERS[0].hostname
    let depSyncStatus: SyncFileStatus[] = []

    for (let dep of dependencies) {
        depSyncStatus.push(await syncFile(ns, dep, "home", bestHost))
    }

    if (depSyncStatus.filter(sts => sts.status !== "OK").length > 0) {
        return { status: depSyncStatus.filter(s => s.status !== "OK")[0].status, host: bestHost, deployment }
    }

    let execStatus = await exec(ns, script, bestHost, threads, args)

    if (execStatus.status !== "OK") {
        return { status: execStatus.status, host: bestHost, deployment }
    }

    return { status: "OK", host: bestHost, deployment }
}