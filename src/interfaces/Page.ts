import Component from './Component';
import Action from './Action';
import T from 'i18n-react';

interface Page {
    id: number
    background?: string
    components: Array<Component>
    _cols?: number
    _rows?: number
    actionToDisplay?: Array<string>
    errorMessage: string
    debug: boolean
}

class Page {

    constructor(id: number, background?: string, components?: Array<any>, cols?: number, rows?: number, actionToDisplay?: Array<string>, debug?: boolean) {
        this.id = id;
        this.background = background || '';
        this.components = components || [];
        this.cols = cols || 0;
        this.rows = rows || 0;
        this.actionToDisplay = actionToDisplay || [];
        this.errorMessage = '';
        this.debug = debug || false;
    }

    public set cols(c: any) {
        this._cols = parseInt(c);
    }

    public get cols(): any {
        return this._cols;
    }

    public set rows(c: any) {
        this._rows = parseInt(c);
    }

    public get rows(): any {
        return this._rows;
    }

    public toJsonData(): PageData {

        let components: Array<ComponentData> = [];
        this.components.forEach(comp => {
            components.push(comp.toJsonData());
        });

        return {
            id: this.id,
            background: this.background,
            components,
            cols: this.cols,
            rows: this.rows,
            actionToDisplay: this.actionToDisplay,
            debug: this.debug
        };
    }

    public isValid(actions: Array<Action>, interfaceIndex: number): boolean {
        let isValid = true;

        this.actionToDisplay.forEach((actionId, i) => {
            if (actions.findIndex(action => { return actionId === action.id }) === -1) {
                this.actionToDisplay.splice(i, 1);
            }
        });
        if (!isValid) {
            this.errorMessage = T.translate('invalid.page', { playerId: interfaceIndex + 1, pageId: this.id }).toString();
            return isValid;
        }

        this.components.forEach((component, i) => {
            if (!component.isValid(actions)) {
                isValid = false;
                this.errorMessage = T.translate('invalid.inpage', { pageId: this.id + 1, playerId: interfaceIndex + 1 }).toString() + ", " + component.errorMessage;
            }
        });

        return isValid;
    }

    public equalsTo(page: Page): boolean {
        let isEqual = true;
        isEqual = this.id === page.id
            && this.rows === page.rows
            && this.cols === page.cols
            && this.background === page.background
            && this.debug === page.debug;

        this.actionToDisplay.forEach((actionId, i) => {
            if (actionId !== page.actionToDisplay[i]) {
                isEqual = false;
            }
        });

        this.components.forEach((component, i) => {
            if (!component.equalsTo(page.components[i])) {
                isEqual = false;
            }
        });

        return isEqual;
    }

    public duplicate(id: number): Page {

        let components: Component[] = [];
        this.components.forEach(component => {
            components.push(component.duplicate());
        });

        return new Page(id, this.background, components, this.cols, this.rows, this.actionToDisplay, this.debug);
    }

    static fromData(data: PageData): Page {
        let { id, background, components, cols, rows, actionToDisplay, debug } = data;

        let componentsData: Array<Component> = [];
        if (components) {
            components.forEach(c => {
                componentsData.push(Component.fromData(c));
            });
        }

        return new this(id, background, componentsData, cols, rows, actionToDisplay, debug);
    }
}

export default Page;