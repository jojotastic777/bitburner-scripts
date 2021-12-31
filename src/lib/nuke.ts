import { NS } from "/../NetscriptDefinitions.js";

type PortBusterFunction = (ns: NS, host: string) => void
class PortBuster {
    private _exec: PortBusterFunction

    constructor(public filename: string, exec: PortBusterFunction) {
        this._exec = exec
    }

    public check(ns: NS): boolean {
        return ns.fileExists(this.filename, "home")
    }

    public exec(ns: NS, host: string): void {
        this._exec(ns, host)
    }
}

const PORT_BUSTERS: PortBuster[] = [
    new PortBuster("BruteSSH.exe",  (ns: NS, host: string) => ns.brutessh(host) ),
    new PortBuster("FTPCrack.exe",  (ns: NS, host: string) => ns.ftpcrack(host) ),
    new PortBuster("relaySMTP.exe", (ns: NS, host: string) => ns.relaysmtp(host)),
    new PortBuster("HTTPWorm.exe",  (ns: NS, host: string) => ns.httpworm(host) ),
    new PortBuster("SQLInject.exe", (ns: NS, host: string) => ns.sqlinject(host))
]

type NukeFailure = "HOME" | "SERVER_MISSING" | "ALREADY_ROOT" | "INSUFFICIENT_PORT_BREAKERS"
type NukeSuccess = "OK"
type NukeStatus  = { status: NukeFailure | NukeSuccess, host: string } 

export function nuke(ns: NS, host: string): NukeStatus {
    const BUSTERS_AVAIL = PORT_BUSTERS.filter(buster => buster.check(ns))

    if (host === "home") {
        return { status: "HOME", host }
    }

    if (!ns.serverExists(host)) {
        return { status: "SERVER_MISSING", host }
    }

    if (ns.hasRootAccess(host)) {
        return { status: "ALREADY_ROOT", host }
    }

    if (ns.getServerNumPortsRequired(host) > BUSTERS_AVAIL.length) {
        return { status: "INSUFFICIENT_PORT_BREAKERS", host }
    }

    BUSTERS_AVAIL.forEach(buster => buster.exec(ns, host))
    ns.nuke(host)

    return { status: "OK", host }
}