import { WebSocketServer } from "ws"
import chokidar from "chokidar"
import fs from "fs"
import { UpdateMessage } from "/../common/UpdateMessage.js"

const PORT: number = parseInt(process.env.PORT ?? "8080")

// Create a new WebSocket server listening on the specified port, defaulting to 8080.
const wss = new WebSocketServer({
    port: PORT
})

wss.on("listening", () => {
    console.log(`Update Server listening on port ${PORT}.`)
})

wss.on("connection", (ws, req) => {
    console.log(`Connection from '${req.socket.remoteAddress}'.`)

    // When a file event happened, send a relevant UpdateMessage.
    let addFile    = (path: string) => ws.send(JSON.stringify({ type: "add",    path, content: fs.readFileSync(path).toString() } as UpdateMessage))
    let changeFile = (path: string) => ws.send(JSON.stringify({ type: "change", path, content: fs.readFileSync(path).toString() } as UpdateMessage))
    let removeFile = (path: string) => ws.send(JSON.stringify({ type: "remove", path                                            } as UpdateMessage))

    // Set up the file watcher.
    let watcher = chokidar.watch("dist/bitburner")
        .on("add", addFile)
        .on("change", changeFile)
        .on("unlink", removeFile)

    ws.on("close", () => {
        console.log(`Closed connection from '${req.socket.remoteAddress}'.`)

        // Stop the relevent file watcher instance when a socket is closed.
        watcher.close()
    })
})
