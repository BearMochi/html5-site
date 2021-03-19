const WebSocket = require('ws');

const createEchoServer = server => {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', (ws, req) => {
        console.log('size:', wsServer.clients.size);
        console.log('remoteAddress:', req.socket.remoteAddress);
        console.log('remotePort:', req.socket.remotePort);
        console.log('localAddress:', req.socket.localAddress);
        console.log('localPort:', req.socket.localPort);
        console.log('socket:', req.socket.address());

        ws.on('message', message => {
            ws.send(message);
        });
        ws.send('連線了');
    });
};
module.exports = createEchoServer;