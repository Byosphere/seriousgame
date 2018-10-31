import T from 'i18n-react';
import Interface from './Interface';
import Action from './Action';
import { ACTION_INITIAL } from 'src/utils/constants';
import { saveStory } from 'src/utils/api';

interface Story {
    id: number
    name: string
    description: string
    _nbPlayers: number
    actions: Array<Action>
    interfaces: Array<Interface>
    errorMessage: string
}

class Story {

    constructor(id: number, name?: string, nbPlayers?: number, actions?: Array<Action>, interfaces?: Array<Interface>, description?: string) {

        this.id = id;
        this.name = name || T.translate('story.defaultname').toString() + ' ' + this.id;
        this._nbPlayers = nbPlayers || 1;
        this.actions = actions || [new Action(ACTION_INITIAL, T.translate('action.initial').toString())];
        this.interfaces = interfaces || [];
        this.description = description || '';
        this.errorMessage = '';
    }

    public isValid(roles: Array<Role>): boolean {
        let isValid = true;

        isValid = this.name !== ''
            && this._nbPlayers > 1
            && this._nbPlayers <= 10;

        if (!isValid) {
            this.errorMessage = T.translate('invalid.story').toString();
            return isValid;
        }

        this.actions.forEach((action, i) => {
            if (!action.isValid()) {
                isValid = false;
                this.errorMessage = action.errorMessage;
            }
        });
        if (!isValid) return isValid;

        this.interfaces.forEach((int, i) => {
            if (!int.isValid(roles, this.actions, i)) {
                isValid = false;
                this.errorMessage = int.errorMessage;
            }
        });

        return isValid;
    }

    public set nbPlayers(nbp: any) {
        this._nbPlayers = parseInt(nbp);
    }

    public get nbPlayers(): any {
        return this._nbPlayers;
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
            nbPlayers: this._nbPlayers,
            actions,
            interfaces,
            description: this.description
        };
    }

    public equalsTo(story: Story): boolean {
        let isEqual = true;
        isEqual = this.id === story.id
            && this.name === story.name
            && this._nbPlayers === story._nbPlayers
            && this.description === story.description;

        this.actions.forEach((action, i) => {
            if (!action.equalsTo(story.actions[i])) {
                isEqual = false;
            }
        });

        this.interfaces.forEach((int, i) => {
            if (!int.equalsTo(story.interfaces[i])) {
                isEqual = false;
            }
        });
        return isEqual;
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