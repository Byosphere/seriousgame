import { SET_PARAMS } from 'src/utils/constants';
import { Parameters } from 'src/interfaces/Parameters';

const initialState: Parameters = {
    imageIa: ''
};

export default (state = initialState, action: any) => {
    let newState = Object.assign({}, state);
    switch (action.type) {

        case SET_PARAMS:
            if (action.params) newState = action.params;
            return newState;

        default:
            return state;
    }
};