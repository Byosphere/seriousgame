interface Interface {
    roleId: number
    pages: Array<Page>
    cols: number
    rows: number
    displayIa: boolean
    messages: Array<Message>
}

class Interface {
    constructor(roleId?: number, pages?: Array<Page>, cols?: number, rows?: number, displayIa?: boolean, messages?: Array<Message>) {
        this.roleId = roleId || null;
        this.pages = pages || [];
        this.cols = cols || 1;
        this.rows = rows || 1;
        this.displayIa = displayIa || true;
        this.messages = messages || [];
    }

    public validate(): boolean {
        return false;
        // TODO
    }

    public isDirty(int: Interface): boolean {
        return false;
        // TODO
    }
}

export default Interface;