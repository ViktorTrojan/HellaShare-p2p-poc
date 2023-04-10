import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws, req) {

  myEmitter.emit("SetId", { ws: ws, peerID: uuidv4() })

  ws.on('message', function message(data) {
    let { event } = JSON.parse(data);
    myEmitter.emit(event, { ...JSON.parse(data), ws: ws, ip: req.socket.address().address })
  });
});
export { myEmitter as server }
