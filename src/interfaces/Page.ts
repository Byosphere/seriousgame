import Component from './Component';

interface Page {
    id: number
    background?: string
    components: Array<Component>
    cols?: number
    rows?: number
    actionToDisplay?: string
}

class Page {

    constructor(id: number, background?: string, components?: Array<any>, cols?: number, rows?: number, actionToDisplay?: string) {
        this.id = id;
        this.background = background || '';
        this.components = components || [];
        this.cols = cols || undefined;
        this.rows = rows || undefined;
        this.actionToDisplay = actionToDisplay || null;
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