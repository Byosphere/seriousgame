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

    socket.on('init', function () {
        if (server.instructor) {
            socket.emit('init', 'player');
            server.players.push({ role: '', name: 'Joueur ' + (server.players.length + 1) });
            socket.broadcast.emit('playerupdate', server.players);
        } else {
            socket.emit('init', 'instructor');
            server.instructor = true; //TRUE
        }
        console.log(server.players);
    });
});