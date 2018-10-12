import * as React from 'react';
import { Button } from '@material-ui/core';

interface Props {
    component: Component
    lastAction: string
    clickAction: Function
}

interface State {
    disabled: boolean
}

class ActionButton extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            disabled: false
        }
    }
    public click() {
        this.setState({
            disabled: true
        });
        this.props.clickAction(this.props.component.clickAction);
    }

    render() {
        return (
            <Button variant="contained" disabled={this.state.disabled} onClick={() => { this.click() }}>Envoyer action</Button>
        );
    }
}

export default ActionButton;