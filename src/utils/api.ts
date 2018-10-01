import * as io from 'socket.io-client';
const socket = io('http://localhost:8081');

function gameConnect(response: any) {
    socket.on('init', (role: string) => response(null, role));
    socket.emit('init');
}

export { gameConnect };