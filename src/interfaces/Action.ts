interface Action {
    id: string
    name: string
    description?: string
    master?: boolean
}

class Action {

    static fromData(data: ActionData): Action {
        let { id, name, description, master } = data;
        return new this(id, name, description, master);
    }

    constructor(id: string, name?: string, description?: string, master?: boolean) {
        this.id = id;
        this.name = name || '';
        this.description = description || '';
        this.master = master || false;
    }

    public equalsTo(action: Action): boolean {
        let isEqual = true;

        isEqual = this.id === action.id
            && this.description === action.description
            && this.name === action.name
            && this.master === action.master;

        return isEqual;
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