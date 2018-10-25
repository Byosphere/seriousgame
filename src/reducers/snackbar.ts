import { SNACKBAR_DISPLAY, SNACKBAR_HIDE } from 'src/utils/constants';

const initialState = {
    open: false,
    message: ''
};

export default (state = initialState, action: any) => {
    let newState = Object.assign({}, state);
    switch (action.type) {

        case SNACKBAR_DISPLAY:
            newState.open = true;
            newState.message = action.message;
            return newState;

        case SNACKBAR_HIDE:
            newState.open = false;
            newState.message = '';
            return newState;

        default:
            return state;
    }
};