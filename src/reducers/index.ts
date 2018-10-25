import { combineReducers } from 'redux';
import story from './story';
import snackbar from './snackbar';

export default combineReducers({
    // ADD REDUCERS
    story,
    snackbar
});