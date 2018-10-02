import * as io from 'socket.io-client';
import { Player } from '../interfaces/Player';
import { Role } from '../interfaces/Role';

const socket = io('http://localhost:8081');

/**
 * Initialisation de la connexion au server
 * @param response : fonction retournant err et le type de joueur
 */
export function gameConnect(response: any) {
    socket.on('init', (type: string) => response(null, type));
    socket.emit('init');
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
export function getRoles(response: any) {
    socket.on('getroles', (roles: Array<Role>) => response(null, roles));
    socket.emit('getroles');
}