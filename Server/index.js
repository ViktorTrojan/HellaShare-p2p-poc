import { server } from "./src/index.js"
let ipMap=new Map()
server.on("InitUser",data=>{
    let {username, peerID, ip, ws} = data;
    ipMap.set(
        ip,{...ipMap.get(ip), [peerID]:{username:username, connection:ws}}
            )
    ws.send(JSON.stringify({...ipMap.get(ip),event:"UserList"}));
})

server.on("SetId",data=>{
    let { ws, peerID } = data
    ws.send(JSON.stringify({"peerID":peerID, event:"SetID"}))
})
