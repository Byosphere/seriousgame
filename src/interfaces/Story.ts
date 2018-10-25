import T from 'i18n-react';
import Interface from './Interface';
import Action from './Action';
import { ACTION_INITIAL } from 'src/utils/constants';

interface Story {
    id: number
    name: string
    description?: string
    nbPlayers: number
    actions: Array<Action>
    interfaces: Array<Interface>
}

class Story {

    constructor(id: number, name?: string, nbPlayers?: number, actions?: Array<Action>, interfaces?: Array<Interface>, description?: string) {

        this.id = id;
        this.name = name || T.translate('story.defaultname').toString() + ' ' + this.id;
        this.nbPlayers = nbPlayers || 1;
        this.actions = actions || [new Action(ACTION_INITIAL, T.translate('action.initial').toString())];
        this.interfaces = interfaces || [];
        this.description = description || '';
    }

    public validate(): boolean {
        return false;
        // TODO
    }

    public static compare(story1: Story, story2: Story): boolean {
        let isDirty = false;

        isDirty = story1.id !== story2.id
            || story1.name !== story2.name
            || story1.nbPlayers !== story2.nbPlayers
            || story1.description !== story2.description;

        return isDirty;
    }
}

export default Story;