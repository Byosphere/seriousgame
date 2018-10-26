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

    static fromData(data: ActionData): Action {
        let { id, name, description, master } = data;
        return new this(id, name, description, master);
    }

    public toJsonData(): ActionData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            master: this.master
        }
    }
}

export default Action;