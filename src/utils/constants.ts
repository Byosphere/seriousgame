export const INSTRUCTOR = 'instructor';
export const PLAYER = 'player';

export const ORANGE = '#ff7900';
export const HAUT = 'haut';
export const BAS = 'bas';

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
    'Quizz': require('../components/quizzdialog/QuizzDialog').default,
    'ActionButton': require('../components/actionbutton/ActionButton').default,
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