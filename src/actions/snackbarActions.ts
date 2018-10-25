import { SNACKBAR_DISPLAY, SNACKBAR_HIDE } from 'src/utils/constants';

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