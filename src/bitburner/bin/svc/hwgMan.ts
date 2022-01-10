/**
 * A Bitburner script which manages the deployment of `hack`, `weaken`, and `grow` scripts.
 * 
 * Usage: `run /bin/svc/hwgMan.js`
 * @module
 */

import { NS } from "bitburner";

type HWGManagerConfiguration = {
    
}

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    while(true) {


        await ns.sleep(1000)
    }
}
