import * as io from 'socket.io-client';
import Story from 'src/interfaces/Story';
import Role from 'src/interfaces/Role';
import Player from 'src/interfaces/Player';

let socket: SocketIOClient.Socket = null;


/**
 * Initialisation de la connexion au server 'http://192.168.1.43:8081'
 * @param response : fonction retournant l'id du joueur
 */
export function playerConnect(addr: string, name: string, response: Function) {
    socket = io(addr);
    socket.on('playerconnect', (resp: any) => response(resp));
    socket.emit('playerconnect', name);
}

export function masterConnect(addr: string, password: string, response: Function) {
    socket = io(addr);
    socket.on('masterconnect', (resp: any) => response(resp));
    socket.emit('masterconnect', password);
}

export function getServerAddr(): string {
    if (socket) {
        return "http://" + socket.io.opts.hostname + ":" + socket.io.opts.port + "/";
    } else {
        return '';
    }
}

/**
 * Chargement de l'ensemble des stories trouvées coté serveur
 */
export function loadStories(response: any) {
    socket.on('getstories', (resp: Array<StoryData>) => {
        let storyList: Array<Story> = [];
        resp.forEach(story => {
            storyList.push(Story.fromData(story));
        });
        response(storyList);
    });
    socket.emit('getstories');
}

/**
 * 
 * @param response 
 */
export function loadRoles(response: Function) {
    socket.on('getroles', (resp: Array<RoleData>) => {
        let roleList: Array<Role> = [];
        resp.forEach(role => {
            roleList.push(Role.fromData(role));
        })
        response(roleList);
    });
    socket.emit('getroles');
}

export function loadPlayers(response: Function) {
    socket.on('getplayers', (resp: Array<PlayerData>) => {
        let playerList: Array<Player> = [];
        resp.forEach(player => {
            if (player) playerList.push(Player.fromData(player));
        });
        response(playerList);
    });
    socket.emit('getplayers');
}

/**
 * 
 * @param roles 
 * @param response 
 */
export function saveRoles(roles: Array<RoleData>, response: Function) {
    socket.on('saveroles', (err: any) => response(err));
    socket.emit('saveroles', roles);
}

export function saveStory(story: StoryData, response: Function) {
    socket.on('savestory', (err: any) => response(err));
    socket.emit('savestory', story);
}

export function deleteStory(storyId: number, response: Function) {
    socket.on('deletestory', (err: any) => response(err));
    socket.emit('deletestory', storyId);
}

/**
 * Ecouteur pour l'instructeur. Est appelée lorsqu'un joueur est mis à jour
 * @param response : fonction retournant err et la liste des joueurs
 */
export function onPlayerUpdate(response: any) {
    socket.on('playerupdate', (resp: Array<Player>) => {
        let playerList: Array<Player> = [];
        resp.forEach(player => {
            if (player) playerList.push(Player.fromData(player));
        })
        response(null, playerList);
    });
}

export function ejectPlayer(playerId?: number) {
    let pid = playerId || 0;
    socket.emit('ejectplayer', pid);
}

export function resetPlayer(playerId?: number) {
    let pid = playerId || 0;
    socket.emit('resetplayer', pid);
}

export function onPlayerReset(response: Function) {
    socket.on('resetplayer', (resp: Array<Player>) => {
        let playerList: Array<Player> = [];
        resp.forEach(player => {
            if (player) playerList.push(Player.fromData(player));
        })
        response(playerList);
    });
}

/**
 * Fonction de sélection d'un joueur
 * @param roleId : id du role choisi
 * @param response : fonction retournant err et un boolean vérifiant si le role a pu être sélectionné
 */
export function selectRole(roleId: number, response: any) {
    socket.on('selectrole', (selected: boolean) => response(null, selected));
    socket.emit('selectrole', roleId);
}

/**
 * Fonction pour récupérer les roles
 * @param response 
 */
export function updateRole(response: Function) {
    socket.on('updaterole', (role: Role) => response(null, role));
}

/**
 * Récupère les infos de la story pour le joueur
 * @param response 
 */
export function getPlayerStory(response: any) {
    socket.on('startstory', (data: any) => response(null, data));
}

/**
 * Active une story pour les joueurs
 * @param storyId : id de la story à lancer
 */
export function startStory(storyId: number) {
    socket.emit('startstory', storyId);
}

/**
 * Fonction d'écoute de lancement d'une story
 * @param response : fonction déclenchée lors du lancement d'une story
 */
export function startGame(response: any) {
    socket.on('startgame', (story: Story) => response(Story.fromData(story)));
}

/**
 * Fonction permettant de donner l'ordre au server de broadcaster une action à tout le monde
 * @param actionId string de l'action à broadcaster
 */
export function sendAction(actionId: string, playerName?: string) {
    socket.emit('dynamicaction', actionId, playerName);
}

/**
 * Ecoute les actions dynamique du server
 * @param response 
 */
export function listenDynamicActions(response: Function) {
    socket.on('dynamicaction', (actionId: string, playerName: string) => {
        response(actionId, playerName);
    });
}

/**
 * Fonction pour l'interface du maitre du jeu permettant de mettre le jeu en pause
 * @param bool play/pause
 * @param response retour du server
 */
export function setPlayPause(bool: boolean, response: any) {
    socket.on('playpause', (bool: boolean) => response(bool));
    socket.emit('playpause', bool);
}

/**
 * Fonction d'écoute pour l'écran de jeu si le jeu doit se mettre en pause
 * @param response fonction executée à la récupération de la réponse
 */
export function playPause(response: Function) {
    socket.on('playpause', (bool: boolean) => response(bool));
}

/**
 * Action retournée si le joueur se déconnecte
 * @param response 
 */
export function onDisconnect(response: Function) {
    socket.on('disconnect', (err: any) => response(err));
}