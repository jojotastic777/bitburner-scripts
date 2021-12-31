export async function main(ns) {
    let updateServer = new WebSocket("ws://127.0.0.1:8080");
    updateServer.onmessage = (event) => {
        let data = JSON.parse(event.data);
        ns.tprintf(data);
        updateServer.close();
    };
}
