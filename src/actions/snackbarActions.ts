import { SNACKBAR_DISPLAY, SNACKBAR_HIDE, CONFIRM_DIALOG_CLOSE, CONFIRM_DIALOG_OPEN } from 'src/utils/constants';
import { ConfirmMessage } from 'src/interfaces/ConfirmMessage';

export function displaySnackbar(message: string) {
    return {
        type: SNACKBAR_DISPLAY,
        message
    }
}

export function hideSnackbar() {
    return {
        type: SNACKBAR_HIDE,
    }
}

export function closeConfirmDialog() {
    return {
        type: CONFIRM_DIALOG_CLOSE
    }
}

export function displayConfirmDialog(message: ConfirmMessage) {
    return {
        type: CONFIRM_DIALOG_OPEN,
        message
    }
}