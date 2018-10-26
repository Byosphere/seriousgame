import T from 'i18n-react';
import Interface from './Interface';
import Action from './Action';
import { ACTION_INITIAL } from 'src/utils/constants';
import { saveStory } from 'src/utils/api';

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

    public isValid(): boolean {
        return true;
        // TODO
    }

    public toJsonData(): StoryData {

        let actions: Array<ActionData> = [];
        this.actions.forEach(action => {
            actions.push(action.toJsonData());
        });

        let interfaces: Array<InterfaceData> = [];
        this.interfaces.forEach(int => {
            interfaces.push(int.toJsonData());
        });

        return {
            id: this.id,
            name: this.name,
            nbPlayers: this.nbPlayers,
            actions,
            interfaces,
            description: this.description
        };
    }

    public equalsTo(story: Story): boolean {
        let isEqual = true;

        isEqual = this.id === story.id
            || this.name === story.name
            || this.nbPlayers === story.nbPlayers
            || this.description !== story.description;

        return isEqual;
        // TODO
    }

    public save(callback?: Function) {
        saveStory(this.toJsonData(), (err: any) => callback(err));
    }

    public static fromData(data: StoryData): Story {
        let { id, name, nbPlayers, actions, interfaces, description } = data;
        let actionsObject: Array<Action> = [];
        let interfacesObject: Array<Interface> = [];
        if (actions) {
            actions.forEach(a => {
                actionsObject.push(Action.fromData(a));
            });
        }

        if (interfaces) {
            interfaces.forEach(a => {
                interfacesObject.push(Interface.fromData(a));
            });
        }

        return new this(id, name, nbPlayers, actionsObject, interfacesObject, description);
    }
}

export default Story;