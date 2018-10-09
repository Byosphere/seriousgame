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
    socket.on('startgame', (story: Story) => response(story));
}

/**
 * Fonction permettant de donner l'ordre au server de broadcaster une action à tout le monde
 * @param action string de l'action à broadcaster
 */
export function sendAction(action: string) {
    socket.emit('dynamicaction', action);
}

/**
 * Fonction permettant d'écouter une action particulère
 * @param action : action à écouter
 * @param response : fonction lorsque l'action est déclenchée
 */
export function listenAction(action: string, response: any) {
    socket.on(action, () => response(action));
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
export function playPause(response: any) {
    socket.on('playpause', (bool: boolean) => response(bool));
}

/**
 * 
 * @param playerId 
 * @param response 
 */
export function onDisconnect(playerId: number, response: any) {

    socket.on('disconnect', () => {
        socket.emit('disconnect');
        response();
    });
}