import Component from './Component';
import Action from './Action';
import T from 'i18n-react';

interface Page {
    id: number
    background?: string
    components: Array<Component>
    cols?: number
    rows?: number
    actionToDisplay?: Array<string>
    errorMessage: string
}

class Page {

    constructor(id: number, background?: string, components?: Array<any>, cols?: number, rows?: number, actionToDisplay?: Array<string>) {
        this.id = id;
        this.background = background || '';
        this.components = components || [];
        this.cols = cols || undefined;
        this.rows = rows || undefined;
        this.actionToDisplay = actionToDisplay || [];
        this.errorMessage = '';
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
            actionToDisplay: this.actionToDisplay
        };
    }

    public isValid(actions: Array<Action>, interfaceIndex: number): boolean {
        let isValid = true;

        this.actionToDisplay.forEach((actionId, i) => {
            if (actions.findIndex(action => { return actionId === action.id }) === -1) {
                isValid = false;
            }
        });
        if (!isValid) {
            this.errorMessage = T.translate('invalid.page', { playerId: interfaceIndex + 1, pageId: this.id + 1 }).toString() + this.id;
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
            && this.background === page.background;

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

    public copy(): Page {
        return new Page(this.id, this.background, this.components, this.cols, this.rows, this.actionToDisplay);
    }

    static fromData(data: PageData): Page {
        let { id, background, components, cols, rows, actionToDisplay } = data;

        let componentsData: Array<Component> = [];
        if (components) {
            components.forEach(c => {
                componentsData.push(Component.fromData(c));
            });
        }

        return new this(id, background, componentsData, cols, rows, actionToDisplay);
    }
}

export default Page;