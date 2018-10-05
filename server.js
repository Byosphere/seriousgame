var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];
server.instructor = false;
server.roles = formatArrayJson(require('./data/roles.json').roles);
server.params = require('./data/params.json').parameters;
server.stories = formatArrayJson(require('./data/stories.json').stories);

io.on('connection', function (socket) {

    /**
     * Initialisation lors de l'arrivée d'un nouveau joueur
     */
    socket.on('init', () => {
        if (server.instructor) {
            socket.emit('init', { type: 'player', params: server.parameters });
            let player = { id: server.players.length, roleId: -1, name: 'Joueur ' + (server.players.length + 1) };
            socket.id = server.players.length;
            server.players[player.id] = player;
            socket.broadcast.emit('playerupdate', server.players);
            console.log('Un nouveau joueur a rejoint la partie : ', player);
        } else {
            socket.emit('init', { type: 'instructor', params: server.parameters });
            server.instructor = true;
            console.log('L\'instructeur a rejoint la partie');
        }
    });

    socket.on('getstories', () => {
        socket.emit('getstories', server.stories);
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
    socket.on('selectrole', (roleId) => {
        if (!server.roles[roleId].disabled) {
            server.players[socket.id].roleId = roleId;
            server.roles[roleId].disabled = true;
            socket.broadcast.emit('playerupdate', server.players);
            socket.broadcast.emit('getroles', server.roles);
            socket.emit('selectrole', true);
        } else {
            socket.emit('selectrole', false);
        }
    });

    socket.on('startstory', (storyId) => {
        let story = server.stories[storyId];
        let roles = [];
        story.roles.forEach(roleId => {
            roles[roleId] = server.roles[roleId];
        });

        socket.broadcast.emit('startstory', { roles: roles, story: story });
    });
});

function formatArrayJson(data) {
    let formattedData = [];
    data.forEach(element => {
        formattedData[element.id] = element;
    });
    return formattedData;
}