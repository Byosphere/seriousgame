interface Action {
    id: string
    name: string
    description?: string
    master?: boolean
}

class Action {
    constructor(id: string, name?: string, description?: string, master?: boolean) {
        this.id = id;
        this.name = name || '';
        this.description = description || '';
        this.master = master || false;
    }
}

export default Action;