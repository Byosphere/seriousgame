import { DARK } from 'src/utils/constants';

interface Role {
    id: number,
    name: string,
    description: string,
    soustitre: string,
    image?: string,
    color?: string,
    theme?: string,
    disabled: Boolean
}

class Role {

    constructor(id: number, name: string, description?: string, soustitre?: string, image?: string, color?: string, theme?: string) {

        this.id = id;
        this.name = name;
        this.description = description || '';
        this.soustitre = soustitre || '';
        this.image = image || 'images/';
        this.color = color || '';
        this.theme = theme || DARK;
        this.disabled = false;
    }

    public copy(id: number): Role {
        return new Role(id, this.name + " (copy)", this.description, this.soustitre, this.image, this.color, this.theme);
    }

    public toJsonData(): RoleData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            soustitre: this.soustitre,
            image: this.image,
            color: this.color,
            theme: this.theme
        }
    }

    public static fromData(rdt: RoleData): Role {
        let { id, name, description, soustitre, image, color, theme } = rdt;
        return new this(id, name, description, soustitre, image, color, theme);
    }
}

export default Role;