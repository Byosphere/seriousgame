import * as React from 'react';

interface Props {
    component: Component
    lastAction: string
}

interface State {

}

class GameComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public canRenderComponent(): boolean {
        return this.props.component.actionToDisplay && this.props.component.actionToDisplay === this.props.lastAction;
    }

    public render(): any {
        return null;
    }
}

export default GameComponent;