import * as io from 'socket.io-client';
import { Player } from '../interfaces/Player';
import { Role } from '../interfaces/Role';
import { Story } from '../interfaces/Story';

const socket = io('http://localhost:8081');

/**
 * Initialisation de la connexion au server
 * @param response : fonction retournant err et le type de joueur + id
 */
export function gameConnect(response: any) {
    socket.on('init', (resp: any) => response(null, resp));
    socket.emit('init');
}

export function loadStories(response: any) {
    socket.on('getstories', (resp: Array<Story>) => response(null, resp));
    socket.emit('getstories');
}

/**
 * Ecouteur pour l'instructeur. Est appelée lorsqu'un joueur est mis à jour
 * @param response : fonction retournant err et la liste des joueurs
 */
export function onPlayerUpdate(response: any) {
    socket.on('playerupdate', (players: Array<Player>) => response(null, players));
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
export function updateRole(response: any) {
    socket.on('updaterole', (role: Role) => response(null, role));
}

export function getStory(response: any) {
    socket.on('startstory', (data: any) => response(null, data));
}

export function startStory(storyId: number) {
    socket.emit('startstory', storyId);
}

export function startGame(response: any) {
    socket.on('startgame', (story: Story) => response(story));
}

export function onDisconnect(playerId: number, response: any) {

    socket.on('disconnect', () => {
        socket.emit('disconnect');
        response();
    });
}