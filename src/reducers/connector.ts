import { SET_CONNECTOR } from 'src/utils/constants';
import Connector from 'src/interfaces/Connector';

const initialState: Connector = null;

export default (state = initialState, action: any) => {
    let newState = Object.assign({}, state);
    switch (action.type) {

        case SET_CONNECTOR:
            if (action.connector) newState = action.connector;
            return newState;

        default:
            return state;
    }
};