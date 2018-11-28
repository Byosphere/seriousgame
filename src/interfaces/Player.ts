interface Player {
    id: number
    name: string,
    roleId: number
}

class Player {

    constructor(id: number, name: string, roleId: number) {
        this.id = id;
        this.name = name;
        this.roleId = roleId;
    }

    public toJsonData(): PlayerData {
        return {
            id: this.id,
            name: this.name,
            roleId: this.roleId
        }
    }

    public static fromData(pld: PlayerData): Player {
        let { id, name, roleId } = pld;
        return new this(id, name, roleId);
    }
}

export default Player;