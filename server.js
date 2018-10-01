var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];

io.on('connection', function (socket) {

    socket.on('init', function () {
        if (server.players.length) {
            socket.emit('init', 'player');
            server.players.push({ role: 'player', name: 'device ' + server.players.length + 1 });
        } else {
            socket.emit('init', 'instructor');
            server.players.push({ role: 'instructor', name: 'device 1' });
        }
        console.log(server.players);
    });
});