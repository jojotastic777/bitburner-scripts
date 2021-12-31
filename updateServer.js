const WebSocket = require("ws")
const fs = require("fs")
const chokidar = require("chokidar")

const PORT = process.env.PORT ?? 8080
const HOST = process.env.LISTEN_HOST ?? "127.0.0.1"

const server = new WebSocket.Server({
    port: PORT,
    host: HOST
})

server.on("listening", () => {
    console.log(`Listening on port ${HOST}:${PORT}.`)
})

let sockets = []

function processFilename(filename) {
    let newFilename = filename.replaceAll("\\", "").slice(4)
    return newFilename[0] === "/" && !newFilename.slice(1).includes("/") ? newFilename.slice(1) : newFilename
}

server.on("connection", (socket) => {
    sockets.push(socket)

    console.log(`Client Connected: ${socket._socket.remoteAddress}`)

    socket.on("message", (msg) => {
        console.log("Recieved Message:", msg.toString())
    })

    socket.on("close", (msg) => {
        console.log(`Client Disconnected: ${socket._socket.remoteAddress}`)
        sockets = sockets.filter(s => s !== socket)
    })


    const updateFile = file => socket.send(JSON.stringify({ eventType: "update", name: processFilename(file), contents: fs.readFileSync(file).toString() }))
    const createFile = file => socket.send(JSON.stringify({ eventType: "creation", name: processFilename(file), contents: fs.readFileSync(file).toString() }))
    const deleteFile = file => socket.send(JSON.stringify({ eventType: "deletion", name: processFilename(file) }))
    chokidar.watch("./dist").on("add", createFile).on("change", updateFile).on("unlink", deleteFile)
})

// chokidar.watch("./dist").on("all", (eventType, file) => {
//     console.log(eventType, file)
// })
