const WebSocket = require("ws")
const fs = require("fs")
const rra = require("recursive-readdir-async")

const PORT = process.env.PORT ?? 8080

const server = new WebSocket.Server({
    port: PORT
})

server.on("listening", () => {
    console.log(`Listening on port ${PORT}.`)
})

let sockets = []

server.on("connection", (socket) => {
    sockets.push(socket)

    console.log(`Client Connected: ${socket._socket.remoteAddress}`)

    socket.on("message", (msg) => {
        console.log("Recieved Message:", msg.toString())
    })

    socket.on("close", (msg) => {
        sockets = sockets.filter(s => s !== socket)
    })

    rra.list("./dist").then(res => socket.send(JSON.stringify(res.map(f => ({ [fs.readFileSync(f.fullname)]: f.fullname })))))
})
