interface Page {
    id: number
    background?: string
    components: Array<any>
    cols?: number
    rows?: number
    actionToDisplay?: string
}

class Page {

    constructor(id: number, background?: string, components?: Array<any>, cols?: number, rows?: number, actionToDisplay?: string) {
        this.id = id;
        this.background = background || '';
        this.components = components || [];
        this.cols = cols || null;
        this.rows = rows || null;
        this.actionToDisplay = actionToDisplay || null;
    }

    public toJsonData(): PageData {
        return {
            id: this.id,
            background: this.background,
            components: this.components,
            cols: this.cols,
            rows: this.rows,
            actionToDisplay: this.actionToDisplay
        };
    }

    static fromData(data: PageData): Page {
        let { id, background, components, cols, rows, actionToDisplay } = data;
        return new this(id, background, components, cols, rows, actionToDisplay);
    }
}

export default Page;