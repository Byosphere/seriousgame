import { SELECT_ACTION, SELECT_STORY } from 'src/utils/constants';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';

interface InitialState {
    story: Story
    action: Action
    initialStory: Story
}

const initialState: InitialState = {
    story: null,
    action: null,
    initialStory: null
};

export default (state = initialState, action: any) => {
    let newState = Object.assign({}, state);
    switch (action.type) {

        case SELECT_ACTION:
            newState.action = action.action;
            return newState;

        case SELECT_STORY:
            newState.story = action.story;
            if(action.story) {
                newState.initialStory = Object.assign({}, action.story);
            }
            return newState;

        default:
            return state;
    }
};