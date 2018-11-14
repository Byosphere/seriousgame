var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const fs = require('fs');
const password = Math.floor(Math.random()*100000);

server.listen(8081, function () {
    console.log("L'adresse du serveur est : " + server.address().port);
    console.log('Le mot de passe temporaire du serveur est : ' + password);
});

var dir = path.join(__dirname, 'data');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

app.get('*', function (req, res) {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

server.players = [];
server.password = password;
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

    socket.on('playerconnect', () => {
        let player = {
            id: server.players.length,
            roleId: -1,
            name: 'Joueur ' + (server.players.length + 1),
            status: 0,
            socketId: socket.id
        };
        socket.id = server.players.length;
        server.players[player.id] = player;
        socket.emit('playerconnect', { id: player.id });
        socket.broadcast.emit('playerupdate', server.players);
        console.log('Un nouveau joueur a rejoint la partie : ', player);
    });

    socket.on('masterconnect', (password) => {
        if (server.password && server.password !== parseInt(password)) {
            socket.emit('masterconnect', { success: false });
            console.log('Mot de passe erroné');
        } else {
            if(server.instructor) io.sockets.connected[server.instructor].disconnect();
            server.instructor = socket.id;
            socket.emit('masterconnect', { success: true });
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
        let json = JSON.stringify(roles, undefined, 4);
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

    socket.on('savestory', story => {
        let json = JSON.stringify(story, undefined, 4);
        fs.writeFile('./data/stories/story' + story.id + '.json', json, null, (err) => {
            socket.emit('savestory', err);
            let storyIndex = server.stories.findIndex(st => { return st.id === story.id });
            if (storyIndex >= 0) {
                server.stories[storyIndex] = story;
            } else {
                server.stories.push(story);
                server.stories.sort((s1, s2) => {
                    if (s1.id < s2.id) return -1;
                    if (s1.id > s2.id) return 1;
                    return 0;
                });
            }
        });
    });

    socket.on('deletestory', storyId => {
        fs.unlink('./data/stories/story' + storyId + '.json', err => {
            socket.emit('deletestory', err);
            let storyIndex = server.stories.findIndex(st => { return st.id === storyId });
            if (storyIndex >= 0) {
                server.stories.splice(storyIndex, 1);
            }
        });
    });

    socket.on('dynamicaction', (actionId) => {
        socket.broadcast.emit('dynamicaction', actionId);
        socket.emit('dynamicaction', actionId);
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

    socket.on('ejectplayer', (playerId) => {
        console.log("Joueur " + playerId + " a été retiré du serveur.");
        io.sockets.connected[server.players[playerId].socketId].disconnect();
        server.players[playerId] = null;
        socket.emit('playerupdate', server.players);
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