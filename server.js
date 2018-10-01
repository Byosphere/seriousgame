var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];
server.instructor = false;

io.on('connection', function (socket) {

    socket.on('init', () => {
        if (server.instructor) {
            socket.emit('init', 'player');
            socket.player = { id: server.players.length, roleId: 0, name: 'Joueur ' + (server.players.length + 1) };
            server.players[socket.player.id] = socket.player;
            socket.broadcast.emit('playerupdate', server.players);
        } else {
            socket.emit('init', 'instructor');
            server.instructor = true;
        }
        console.log(server.players);
    });

    socket.on('selectrole', (roleId) => {
        let open = true;
        server.players.forEach(player => {
            if (player.roleId === roleId) {
                open = false;
            }
        });
        if (open) {
            socket.player.roleId = roleId;
            server.players[socket.player.id].roleId = roleId;
            socket.broadcast.emit('playerupdate', server.players);
            socket.emit('selectrole', true);
        } else {
            socket.emit('selectrole', false);
        }
    });
});