import { COMPONENTS_LIST } from 'src/utils/constants';

interface Component {
    id: number
    name: string
    cols: string
    rows: string
    actionToDisplay?: Array<string>
    clickAction?: string
    params?: any
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