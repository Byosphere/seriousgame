import { combineReducers } from 'redux';
import story from './story';
import dialog from './dialog';
import params from './params';

export default combineReducers({
    // ADD REDUCERS
    story,
    dialog,
    params
});