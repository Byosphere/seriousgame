import { SET_CONNECTOR } from 'src/utils/constants';
import Connector from 'src/interfaces/Connector';

export function setConnector(connector: Connector) {
    return {
        type: SET_CONNECTOR,
        connector
    }
}