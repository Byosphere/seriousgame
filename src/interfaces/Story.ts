interface Story {
    id: number
    name: string
    description?: string
    nbPlayers: number
    actions: Array<Action>
    interfaces: Array<Interface>
}