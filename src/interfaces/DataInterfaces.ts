interface StoryData {
    id: number
    name: string
    description?: string
    nbPlayers: number
    actions: Array<ActionData>
    interfaces: Array<InterfaceData>
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
    action?: string
}

interface PageData {
    id: number
    background?: string
    components: Array<ComponentData>
    cols?: number
    rows?: number
    actionToDisplay?: Array<string>
}

interface ComponentData {
    id: number
    name: string
    cols: string
    rows: string
    actionToDisplay?: Array<string>
    clickAction?: string
    params?: any
}