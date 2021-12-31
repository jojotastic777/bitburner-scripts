import * as global from "/lib/global.js";
export class Logger {
    ns;
    name;
    logLevel;
    sessionStart;
    constructor(ns, name, logLevel) {
        this.ns = ns;
        this.name = name;
        this.logLevel = logLevel;
        this.sessionStart = Date.now();
    }
    debug(msg) {
        if (["debug"].includes(this.logLevel)) {
            this.ns.tprintf(`[DEBUG] [${this.name}]: ${msg}`);
        }
        global.data.logService?.messageQueue?.push({ programName: this.name, logLevel: "debug", msg, timestamp: Date.now(), sessionStart: this.sessionStart });
    }
    info(msg) {
        if (["debug", "info"].includes(this.logLevel)) {
            this.ns.tprintf(`[INFO] [${this.name}]: ${msg}`);
        }
        global.data.logService?.messageQueue?.push({ programName: this.name, logLevel: "info", msg, timestamp: Date.now(), sessionStart: this.sessionStart });
    }
    warn(msg) {
        if (["debug", "info", "warn"].includes(this.logLevel)) {
            this.ns.tprintf(`[WARN] [${this.name}]: ${msg}`);
        }
        global.data.logService?.messageQueue?.push({ programName: this.name, logLevel: "warn", msg, timestamp: Date.now(), sessionStart: this.sessionStart });
    }
    error(msg) {
        if (["debug", "info", "warn", "error"].includes(this.logLevel)) {
            this.ns.tprintf(`[ERROR] [${this.name}]: ${msg}`);
        }
        global.data.logService?.messageQueue?.push({ programName: this.name, logLevel: "error", msg, timestamp: Date.now(), sessionStart: this.sessionStart });
    }
}
