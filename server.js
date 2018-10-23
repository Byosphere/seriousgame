var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const fs = require('fs');

server.listen(8081, function () {
    console.log('Listening on ' + server.address().port);
});

server.players = [];
server.instructor = null;
server.roles = require('./data/roles.json');
server.params = require('./data/general.json').parameters;
server.stories = [];
fs.readdirSync('./data/stories/').forEach(file => {
    let story = require('./data/stories/' + file);
    server.stories.push(story);
});
server.selectedStory = null;

io.on('connection', function (socket) {

    /**
     * Initialisation lors de l'arrivée d'un nouveau joueur
     */
    socket.on('init', () => {

        if (server.instructor) {
            let player = {
                id: server.players.length,
                roleId: -1,
                name: 'Joueur ' + (server.players.length + 1),
                status: 0
            };
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

    socket.on('getroles', () => {
        socket.emit('getroles', server.roles);
    });

    socket.on('saveroles', (roles) => {
        let json = JSON.stringify(roles);
        fs.writeFile('./data/roles.json', json, null, (err) => {
            socket.emit('saveroles', err);
            server.roles = roles;
        });
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
        let selectedRole = server.roles.find(role => { return role.id === roleId });

        if (!selectedRole.disabled) {
            server.players[socket.id].roleId = roleId;
            selectedRole.disabled = true;
            server.players[socket.id].status = 0;
            socket.broadcast.emit('updaterole', selectedRole);
            socket.emit('selectrole', true);

            let playersReady = true
            server.players.forEach(player => {
                if (player && player.roleId < 0) playersReady = false;
            });
            if (playersReady) {
                server.players.forEach(player => {
                    if (player) {
                        player.status = 2;
                    }
                });

                socket.broadcast.emit('startgame', server.selectedStory);
            }
            socket.broadcast.emit('playerupdate', server.players);

        } else {
            socket.emit('selectrole', false);
        }
    });

    /**
     * Lancement d'une story par le maître du jeu
     */
    socket.on('startstory', (storyId) => {
        let story = server.stories.find(story => { return story.id === storyId });
        let roles = [];
        story.interfaces.forEach(interface => {
            roles.push(server.roles.find(role => { return role.id === interface.roleId }));
        });
        server.selectedStory = story;
        socket.broadcast.emit('startstory', { roles: roles, story: story });
    });

    socket.on('dynamicaction', (action) => {
        socket.broadcast.emit('dynamicaction', action);
        socket.emit('dynamicaction', action);
    });

    /**
     * Action pour mettre en pause la partie
     */
    socket.on("playpause", (bool) => {
        socket.emit('playpause', bool);
        socket.broadcast.emit('playpause', bool);
    });

    socket.on('quitgame', () => {
        if (server.players[socket.id].roleId > -1) {
            let role = server.roles.find(role => { return role.id === server.players[socket.id].roleId });
            role.disabled = false;
            server.players[socket.id].roleId = -1;
        }

        socket.broadcast.emit('playerupdate', server.players);
        server.selectedStory = null;
        socket.broadcast.emit('adminquit');
        socket.emit('quitgame');
    });

    /**
     * Action lorsqu'un joueur se déconnecte
     */
    socket.on('disconnect', () => {

        if (server.players[socket.id]) {
            console.log('player ' + socket.id + ' disconnected');
            if (server.players[socket.id].roleId > -1) {
                let role = server.roles.find(role => { return role.id === server.players[socket.id].roleId });
                role.disabled = false;
            }
            server.players[socket.id] = null;
            socket.broadcast.emit('playerupdate', server.players);
        } else if (server.instructor === socket.id) {
            console.log('L\'instructeur a quitté la partie');
            server.instructor = null;
        }
    });
});