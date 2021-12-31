import { NS } from "/../NetscriptDefinitions.js"
import * as global from "/lib/global.js"

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent"

export type LogMessage = {
    /**
     * The name of the program writing the log message.
     */
    programName: string

    /**
     * The LogLevel of the log message.
     */
    logLevel: LogLevel

    /**
     * The log message text.
     */
    msg: string

    /**
     * The timestamp when the message was written.
     */
    timestamp: number

    /**
     * The timestamp when the logging session started.
     */
    sessionStart: number
}

export class Logger {
    public sessionStart: number

    constructor(
        private ns: NS,
        public name: string,
        public logLevel: LogLevel
    ) {
        this.sessionStart = Date.now()

        // if (global.data.logService === undefined) {
        //     global.data.logService = {
        //         messageQueue: []
        //     }
        // }
    }

    public debug(msg: string): void {
        if ([ "debug" ].includes(this.logLevel)) {
            this.ns.tprintf(`[DEBUG] [${this.name}]: ${msg}`)
        }

        // global.data.logService?.messageQueue?.push({ programName: this.name, logLevel: "debug", msg, timestamp: Date.now(), sessionStart: this.sessionStart })
    }

    public info(msg: string): void {
        if ([ "debug", "info" ].includes(this.logLevel)) {
            this.ns.tprintf(`[INFO] [${this.name}]: ${msg}`)
        }

        // global.data.logService?.messageQueue.push({ programName: this.name, logLevel: "info", msg, timestamp: Date.now(), sessionStart: this.sessionStart })
    }

    public warn(msg: string): void {
        if ([ "debug", "info", "warn" ].includes(this.logLevel)) {
            this.ns.tprintf(`[WARN] [${this.name}]: ${msg}`)
        }

        // global.data.logService?.messageQueue.push({ programName: this.name, logLevel: "warn", msg, timestamp: Date.now(), sessionStart: this.sessionStart })
    }

    public error(msg: string): void {
        if ([ "debug", "info", "warn", "error" ].includes(this.logLevel)) {
            this.ns.tprintf(`[ERROR] [${this.name}]: ${msg}`)
        }

        // global.data.logService?.messageQueue.push({ programName: this.name, logLevel: "error", msg, timestamp: Date.now(), sessionStart: this.sessionStart })
    }
}