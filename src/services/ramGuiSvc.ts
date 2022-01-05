import { NS } from "/../NetscriptDefinitions.js";
import { Indicator } from "/lib/gui.js";
import { scan } from "/lib/scan.js";

export async function main(ns: NS) {
    let maxRamIndic         = new Indicator(ns, "Max RAM", "")
    let maxContigRamIndic   = new Indicator(ns, "Max Contig RAM", "")
    let usedRamIndic        = new Indicator(ns, "Used RAM", "")
    let availRamIndic       = new Indicator(ns, "Available RAM", "")
    let availContigRamIndic = new Indicator(ns, "Available Contig RAM", "")

    ns.atExit(() => {
        maxRamIndic.remove()
        maxContigRamIndic.remove()
        usedRamIndic.remove()
        availRamIndic.remove()
        availContigRamIndic.remove()
    })
    
    while (true) {
        const SERVERS = scan(ns)
        const AVAIL_SERVERS = SERVERS
            .map(srv => ns.getServer(srv))
            .filter(srv => srv.hasAdminRights && srv.maxRam > 0)
        
        const TOTAL_RAM    = AVAIL_SERVERS.map(srv => srv.maxRam).reduce((acc, cur) => acc + cur)
        const USED_RAM     = AVAIL_SERVERS.map(srv => srv.ramUsed).reduce((acc, cur) => acc + cur)
        const AVAIL_RAM    = TOTAL_RAM - USED_RAM
        const MAX_CONTIG   = AVAIL_SERVERS.map(srv => srv.maxRam).reduce((acc, cur) => Math.max(acc, cur))
        const AVAIL_CONTIG = AVAIL_SERVERS.map(srv => srv.maxRam - srv.ramUsed).reduce((acc, cur) => Math.max(acc, cur))

        maxRamIndic.setValue(TOTAL_RAM.toFixed(2) + "GB")
        usedRamIndic.setValue(USED_RAM.toFixed(2) + "GB")
        availRamIndic.setValue(AVAIL_RAM.toFixed(2) + "GB")
        maxContigRamIndic.setValue(MAX_CONTIG.toFixed(2) + "GB")
        availContigRamIndic.setValue(AVAIL_CONTIG.toFixed(2) + "GB")

        await ns.sleep(1000)
    }
}
