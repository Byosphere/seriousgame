export const INSTRUCTOR = 'instructor';
export const PLAYER = 'player';

export const ORANGE = '#ff7900';
export const HAUT = 'haut';
export const BAS = 'bas';
export const DARK = "dark";
export const LIGHT = "light";
export const SERVER_WAIT = 5000;

export const DISCONNECTED = 'disconnected';
export const CONNECT = 'connect';

export const ACTION_INITIAL = 'initial_action';
export const PLACEMENT = [
    'center',
    'top_left',
    'top_right',
    'bottom_left',
    'bottom_right',
    'top_center',
    'bottom_center'
]
/*
 + + + + + IN GAME COMPONENTS LIST + + + + +
*/
export const DYNAMIC_COMPONENTS = {
    'Quizz': require('../gamecomponents/quizzdialog/QuizzDialog').default,
    'ActionButton': require('../gamecomponents/actionbutton/ActionButton').default,
    'ImageClickable': require('../gamecomponents/imageclickable/ImageClickable').default
};

/*
 + + + + + REDUX CONSTANTS + + + + +
*/
export const SNACKBAR_DISPLAY = "snackbar_display";
export const SNACKBAR_HIDE = "snackbar_hide";
export const SELECT_ACTION = "select_action";
export const SELECT_STORY = "select-story";
export const CONFIRM_DIALOG_CLOSE = 'confirm_dialog_close';
export const CONFIRM_DIALOG_OPEN = 'confirm_dialog-open';