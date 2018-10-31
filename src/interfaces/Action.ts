import { isBoolean } from 'util';

interface Action {
    id: string
    name: string
    description?: string
    master?: boolean
    errorMessage: string
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

    public isValid(): any {
        let isValid = true;
        isValid = this.id !== ''
            && this.name !== ''
            && isBoolean(this.master);

        return isValid;
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