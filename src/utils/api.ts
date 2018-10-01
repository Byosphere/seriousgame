import * as io from 'socket.io-client';
const socket = io('http://localhost:8081');

export function gameConnect(response: any) {
    socket.on('init', (role: string) => response(null, role));
    socket.emit('init');
}

export function onPlayerUpdate(response: any) {
    socket.on('playerupdate', (players: Array<Object>) => response(null, players));
}