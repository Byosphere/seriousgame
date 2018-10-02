var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];
server.instructor = false;
server.roles = require('./data/roles.json').roles;

io.on('connection', function (socket) {

    /**
     * Initialisation lors de l'arrivée d'un nouveau joueur
     */
    socket.on('init', () => {
        if (server.instructor) {
            socket.emit('init', 'player');
            let player = { id: server.players.length, roleIndex: -1, name: 'Joueur ' + (server.players.length + 1) };
            socket.id = server.players.length;
            server.players[player.id] = player;
            socket.broadcast.emit('playerupdate', server.players);
            console.log('Un nouveau joueur a rejoint la partie : ', player);
        } else {
            socket.emit('init', 'instructor');
            server.instructor = true;
            console.log('L\'instructeur a rejoint la partie');
        }
    });

    /**
     * Retourne les roles possibles pour la partie (voir le fichier des roles)
     */
    socket.on('getroles', () => {
        socket.emit('getroles', server.roles);
    });

    /**
     * Met à jour la liste des rôles et les attribut aux joueurs
     */
    socket.on('selectrole', (roleIndex) => {
        if (!server.roles[roleIndex].disabled) {
            server.players[socket.id].roleIndex = roleIndex;
            server.roles[roleIndex].disabled = true;
            socket.broadcast.emit('playerupdate', server.players);
            socket.broadcast.emit('getroles', server.roles);
            socket.emit('selectrole', true);
        } else {
            socket.emit('selectrole', false);
        }
    });
});