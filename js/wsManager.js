const WebSocket = require("ws")
const {
    encode,
    decode
} = require("msgpack-lite")
const http = require("http")
const Response = http.IncomingMessage

var ws = new WebSocket("wss://social.krunker.io/ws")

ws.onopen = () => {
    console.log('Connected to wss://social.krunker.io/ws');
    pong();
};

ws.onmessage = async function (event) {
    var blob = event.data;
    var data = decode(new Uint8Array(blob))

    if (data[0] == "pi") {
        pong();
    }
}

pong = () => {
    ws.send(encode(["po"]).buffer);
}

module.exports.sendData = function (array) {
    return new Promise((res, rej) => {
        var statsEncoded = encode(array).buffer;
        ws.send(statsEncoded);
        ws.onmessage = async function (event) {
            var blob = event.data;
            var data = decode(new Uint8Array(blob))

            if (data[0] == "pi") {
                pong();
            } else if (data[0] == "pir") {

            } else {
                res(data);
                console.log(data)
            }

            ws.onerror = () => {
                rej(err)
            }
        }
    })
}