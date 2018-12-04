interface StoryData {
    id: number
    name: string
    description?: string
    nbPlayers: number
    actions: Array<ActionData>
    interfaces: Array<InterfaceData>
    filename: string
}

interface ActionData {
    id: string
    name: string
    description?: string
    master?: boolean
}

interface InterfaceData {
    roleId: number
    pages: Array<PageData>
    cols: number
    rows: number
    displayIa: boolean
    messages: Array<MessageData>
}

interface MessageData {
    text: string
    position: string
    force: number
    clickAction?: string
    action: string
}

interface PageData {
    id: number
    background?: string
    components: Array<ComponentData>
    cols?: number
    rows?: number
    actionToDisplay?: Array<string>
    debug: boolean
}

interface ComponentData {
    id: number
    type: string
    name: string
    cols: string
    rows: string
    position: string
    actionToDisplay?: Array<string>
    clickAction?: string
    params?: any
}

interface RoleData {
    id: number
    name: string
    description: string
    soustitre: string
    image?: string
    color?: string
    theme?: string
}

interface PlayerData {
    id: number
    name: string
    roleId: number
}