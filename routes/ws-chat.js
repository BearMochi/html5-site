const WebSocket = require('ws');

module.exports = server => {
    const map = new Map;
    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', (ws, req) => {
        map.set(ws, { name: '' });

        ws.on('message', message => {
            const mObj = map.get(ws);
            let msg = '';
            if (!mObj.name) {
                mObj.name = message;
                msg = `${mObj.name} 進入聊天室, 共 ${wsServer.clients.size} 人`;
            } else {
                msg = `${mObj.name}: ${message}`;
            }
            wsServer.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(msg);
                }
            })
        });

    });
};
