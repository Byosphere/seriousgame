import { SNACKBAR_DISPLAY, SNACKBAR_HIDE, CONFIRM_DIALOG_OPEN, CONFIRM_DIALOG_CLOSE } from 'src/utils/constants';
import { ConfirmMessage } from 'src/interfaces/ConfirmMessage';

interface DialogState {
    openSnackbar: boolean
    messageSnackbar: string
    confirmDialogInfo: ConfirmMessage
    openConfirmDialog: boolean
}

const initialState: DialogState = {
    openSnackbar: false,
    messageSnackbar: '',
    confirmDialogInfo: null,
    openConfirmDialog: false
};

export default (state = initialState, action: any) => {
    let newState = Object.assign({}, state);
    switch (action.type) {

        case SNACKBAR_DISPLAY:
            newState.openSnackbar = true;
            newState.messageSnackbar = action.message;
            return newState;

        case SNACKBAR_HIDE:
            newState.openSnackbar = false;
            newState.messageSnackbar = '';
            return newState;

        case CONFIRM_DIALOG_OPEN:
            newState.openConfirmDialog = true;
            newState.confirmDialogInfo = action.message;
            return newState;

        case CONFIRM_DIALOG_CLOSE:
            newState.openConfirmDialog = false;
            newState.confirmDialogInfo = null;
            return newState;

        default:
            return state;
    }
};