export interface Story {
    id: number
    name: string
    description?: string
    nbPlayers: number
    actions: Array<Action>
    roles: Array<number>
    interfaces: Array<Interface>
}