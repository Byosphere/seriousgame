import Component from "./Component";

export interface GameProps {
    component: Component
    lastAction: string
    sendAction: Function
    params?: any
}

export interface GameState {}

export interface GameComponent extends React.Component<GameProps, GameState> {}