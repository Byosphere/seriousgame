import { combineReducers } from 'redux';
import story from './story';
import dialog from './dialog';
import connector from './connector';

export default combineReducers({
    // ADD REDUCERS
    story,
    dialog,
    connector
});