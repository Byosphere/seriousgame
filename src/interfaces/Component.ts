import { COMPONENTS_LIST } from 'src/utils/constants';
import Action from './Action';
import T from 'i18n-react';

interface Component {
    id: number
    name: string
    cols: string
    rows: string
    actionToDisplay?: Array<string>
    clickAction?: string
    params?: any
    errorMessage: string
}

class Component {


    constructor(id: number, name?: string, cols?: string, rows?: string, actionToDisplay?: Array<string>, clickAction?: string, params?: any) {
        this.id = id;
        this.name = name || COMPONENTS_LIST[0];
        this.cols = cols || '1';
        this.rows = rows || '1';
        this.actionToDisplay = actionToDisplay || [];
        this.clickAction = clickAction || '';
        this.params = params || {};
        this.errorMessage = '';
    }

    public copy(): Component {
        return new Component(this.id, this.name, this.cols, this.rows, this.actionToDisplay, this.clickAction, this.params);
    }

    public getStringParams() {
        return JSON.stringify(this.params, undefined, 4);
    }

    public setStringParams(value: any) {
        this.params = JSON.parse(value);
    }

    public isValid(actions: Array<Action>): boolean {
        let isValid = true;

        isValid = this.id > 0
            && COMPONENTS_LIST.findIndex(cmp => { return cmp === this.name }) > -1
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
        let { id, name, cols, rows, actionToDisplay, clickAction, params } = data;
        return new this(id, name, cols, rows, actionToDisplay, clickAction, params);
    }

    public toJsonData(): ComponentData {
        return {
            id: this.id,
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