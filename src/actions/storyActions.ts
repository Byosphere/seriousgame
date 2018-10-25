import { SELECT_ACTION, SELECT_STORY } from 'src/utils/constants';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';

export function selectCurrentAction(action: Action) {
    return {
        type: SELECT_ACTION,
        action
    }
}

export function selectCurrentStory(story: Story) {
    return {
        type: SELECT_STORY,
        story
    }
}