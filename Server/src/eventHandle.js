import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

import { Logger } from './Logger.js';

const PORT = 8080;
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
let WebSockets = []

const wss = new WebSocketServer({ port: PORT });

// Event gets called when Peer Connects
wss.on('connection', function connection(ws, req) {
  let peerID = uuidv4()
  WebSockets.push([ws, req])
  // Fires and gets executed in index.js by server
  myEmitter.emit("SetId", { ws: ws, peerID: peerID })
  
  // TODO: add comments
  for (const _ws of WebSockets) {
    if (_ws[1].socket.address().address !== req.socket.address().address) return
    _ws[0].send(JSON.stringify({ "New Connection by id: ": peerID }))
  }

  ws.on('message', function message(data) {
    let { event } = JSON.parse(data);
    myEmitter.emit(event, { ...JSON.parse(data), ws: ws, ip: req.socket.address().address })
  });


  ws.on("close", () => {
    // Gets called when user disconnects
    myEmitter.emit("disconnect", { ws: ws, id: peerID })
  })
});


Logger.info("[+] Started the Server on Port: " + PORT)

export { myEmitter as server }