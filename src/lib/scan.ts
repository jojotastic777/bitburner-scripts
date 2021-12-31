import { NS } from "/../NetscriptDefinitions.js";

export function scan(ns: NS): string[] {
    let servers: string[] = [ "home" ]

    let oldServersLen = 0

    while (oldServersLen < servers.length) {
        oldServersLen = servers.length
        servers = [ ...new Set([ ...servers, ...servers.map(srv => ns.scan(srv)).reduce((acc, cur) => acc.concat(cur)) ]) ]
    }

    return servers
}
