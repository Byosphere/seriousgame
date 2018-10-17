interface Props {
    component: Component
    lastAction: string
    sendAction: Function
    params?: any
}

interface State {}

interface GameComponent extends React.Component<Props, State> {}