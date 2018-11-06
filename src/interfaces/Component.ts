import { COMPONENTS_LIST } from 'src/utils/constants';
import Action from './Action';
import T from 'i18n-react';

interface Component {
    id: number
    type: string
    name: string
    cols: string
    rows: string
    actionToDisplay?: Array<string>
    clickAction?: string
    params?: any
    errorMessage: string
}

class Component {


    constructor(id: number, type: string, name?: string, cols?: string, rows?: string, actionToDisplay?: Array<string>, clickAction?: string, params?: any) {
        this.id = id;
        this.type = type;
        this.name = name || T.translate('interface.component').toString() + id;
        this.cols = cols || '1';
        this.rows = rows || '1';
        this.actionToDisplay = actionToDisplay || [];
        this.clickAction = clickAction || '';
        this.params = params || {};
        this.errorMessage = '';
    }

    public copy(): Component {
        return new Component(this.id, this.type, this.name, this.cols, this.rows, this.actionToDisplay, this.clickAction, this.params);
    }

    public getStringParams() {
        return JSON.stringify(this.params, undefined, 4);
    }

    public setStringParams(value: any): boolean {
        try {
            this.params = JSON.parse(value);
        } catch(err) {
            return false;
        }
        return true;
    }

    public isValid(actions: Array<Action>): boolean {
        let isValid = true;

        isValid = this.id > 0
            && COMPONENTS_LIST.findIndex(cmp => { return cmp === this.type }) > -1
            && this.cols !== ''
            && this.rows !== '';

        this.actionToDisplay.forEach((actionId, i) => {
            if (actions.findIndex(action => { return actionId === action.id }) === -1) {
                isValid = false;
            }
        });
        if (!isValid) this.errorMessage = T.translate('invalid.component').toString();
        return isValid;
    }

    public equalsTo(component: Component): boolean {
        let isEqual = true;
        isEqual = this.id === component.id
            && this.type === component.type
            && this.name === component.name
            && this.rows === component.rows
            && this.cols === component.cols
            && this.clickAction === component.clickAction
            && this.getStringParams() === component.getStringParams();

        this.actionToDisplay.forEach((actionId, i) => {
            if (actionId !== component.actionToDisplay[i]) {
                isEqual = false;
            }
        });

        return isEqual;
    }

    static fromData(data: ComponentData): Component {
        let { id, type, name, cols, rows, actionToDisplay, clickAction, params } = data;
        return new this(id, type, name, cols, rows, actionToDisplay, clickAction, params);
    }

    public toJsonData(): ComponentData {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            cols: this.cols,
            rows: this.rows,
            actionToDisplay: this.actionToDisplay,
            clickAction: this.clickAction,
            params: this.params
        };
    }

}

export default Component;