interface Role {
    id: number,
    name: string,
    description: string,
    soustitre: string,
    image?: string,
    color?: string,
    disabled: Boolean
}

class Role {

    constructor(id: number, name: string, description?: string, soustitre?: string, image?: string, color?: string) {

        this.id = id;
        this.name = name;
        this.description = description || '';
        this.soustitre = soustitre || '';
        this.image = image || '';
        this.color = color || '';
        this.disabled = false;
    }

    public toJsonData(): RoleData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            soustitre: this.soustitre,
            image: this.image,
            color: this.color
        }
    }

    public static fromData(rdt: RoleData): Role {
        let { id, name, description, soustitre, image, color } = rdt;
        return new this(id, name, description, soustitre, image, color);
    }
}

export default Role;