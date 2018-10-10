var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];
server.instructor = null;
server.roles = formatArrayJson(require('./data/roles.json').roles);
server.params = require('./data/params.json').parameters;
server.stories = formatArrayJson(require('./data/stories.json').stories);
server.selectedStory = null;

io.on('connection', function (socket) {

    /**
     * Initialisation lors de l'arrivée d'un nouveau joueur
     */
    socket.on('init', () => {

        if (server.instructor) {
            let player = { id: server.players.length, roleId: -1, name: 'Joueur ' + (server.players.length + 1) };
            socket.id = server.players.length;
            server.players[player.id] = player;
            socket.emit('init', { id: player.id, type: 'player', params: server.parameters });
            socket.broadcast.emit('playerupdate', server.players);
            console.log('Un nouveau joueur a rejoint la partie : ', player);
        } else {
            socket.emit('init', { id: socket.id, type: 'instructor', params: server.parameters });
            server.instructor = socket.id;
            console.log('L\'instructeur a rejoint la partie');
        }
    });

    socket.on('getstories', () => {
        socket.emit('getstories', server.stories);
    });

    /**
     * Retourne les roles possibles pour la partie (voir le fichier des roles)
     */
    socket.on('updaterole', (role) => {
        socket.emit('updaterole', role);
    });

    /**
     * Met à jour la liste des rôles et les attribut aux joueurs
     */
    socket.on('selectrole', (roleId) => {
        if (!server.roles[roleId].disabled) {
            server.players[socket.id].roleId = roleId;
            server.roles[roleId].disabled = true;
            socket.broadcast.emit('playerupdate', server.players);
            socket.broadcast.emit('updaterole', server.roles[roleId]);
            socket.emit('selectrole', true);

            let playersReady = true
            server.players.forEach(player => {
                if (player.roleId < 0) playersReady = false;
            });
            if (playersReady) {
                socket.broadcast.emit('startgame', server.selectedStory);
            }

        } else {
            socket.emit('selectrole', false);
        }
    });

    /**
     * Lancement d'une story par le maître du jeu
     */
    socket.on('startstory', (storyId) => {
        let story = server.stories[storyId];
        let roles = [];
        story.roles.forEach(roleId => {
            roles[roleId] = server.roles[roleId];
        });
        server.selectedStory = story;
        socket.broadcast.emit('startstory', { roles: roles, story: story });
    });

    socket.on('dynamicaction', (action) => {
        socket.broadcast.emit(action);
    });

    /**
     * Action pour mettre en pause la partie
     */
    socket.on("playpause", (bool) => {
        socket.emit('playpause', bool);
        socket.broadcast.emit('playpause', bool);
    });

    /**
     * Action lorsqu'un joueur se déconnecte
     */
    socket.on('disconnect', () => {

        if (server.players[socket.id]) {
            console.log('player ' + socket.id + ' disconnected');
            if (server.players[socket.id].roleId > -1) {
                server.roles[server.players[socket.id].roleId].disabled = false;
            }
            server.players[socket.id] = null;
            socket.broadcast.emit('playerupdate', server.players);
        } else if (server.instructor === socket.id) {
            console.log('L\'instructeur a quitté la partie');
            server.instructor = null;
        }
    });
});

function formatArrayJson(data) {
    let formattedData = [];
    data.forEach(element => {
        formattedData[element.id] = element;
    });
    return formattedData;
}